package main

import (
	"context"
	"crypto/sha1"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/go-redis/redis/v8"
	_ "github.com/lib/pq"
)

var (
	ctx = context.Background()
)

func SetNewData(client redis.Client, value string) string {
	if len([]rune(value)) >= 8 {
		h := sha1.New()
		h.Write([]byte(value))
		sha1_hash := hex.EncodeToString(h.Sum(nil))
		client.Set(ctx, sha1_hash, value, 0).Err()
		return sha1_hash
	} else {
		return "input invalid"
	}
}

func GetData(client redis.Client, key string) string {
	val2, err2 := client.Get(ctx, key).Result()
	if err2 != nil {
		panic(err2)
	}
	return val2
}

func main() {

	client := redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "", // no password set
		DB:       0,  // use default DB
	})

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/sha256" {
			http.Error(w, "404 not found.", http.StatusNotFound)
			return
		}
		switch r.Method {
		case "GET":
			query := r.URL.Query()
			/*
				"sha_hash" is the name of Frontend query for finding a key base on its hash
				for example "http://localhost:8080/sha256?sha_hash=68c5f75d96a3e0ef04e368ccf8158bbc37967c2c"
			*/
			sha_hash, present := query["sha_hash"]
			if !present || len(sha_hash) == 0 {
				fmt.Println("filters not present")
			}
			result := GetData(*client, sha_hash[0])
			w.WriteHeader(http.StatusCreated)
			w.Header().Set("Content-Type", "application/json")
			resp := make(map[string]string)
			resp[result] = sha_hash[0]
			jsonResp, err := json.Marshal(resp)
			if err != nil {
				log.Fatalf("Error happened in JSON marshal. Err: %s", err)
			}
			w.Write(jsonResp)
		case "POST":
			if err := r.ParseForm(); err != nil {
				fmt.Fprintf(w, "ParseForm() err: %v", err)
				return
			}
			/*
				"value" is the name of Frontend query for creat a new key
				curl "http://localhost:8080/sha256" -X POST -d "value=mohammadreza"
				in commandLine
			*/
			value := r.FormValue("value")
			result := SetNewData(*client, value)
			if result != "input invalid" {
				w.WriteHeader(http.StatusCreated)
				w.Header().Set("Content-Type", "application/json")
				resp := make(map[string]string)
				resp[value] = result
				jsonResp, err := json.Marshal(resp)
				if err != nil {
					log.Fatalf("Error happened in JSON marshal. Err: %s", err)
				}
				w.Write(jsonResp)
			} else {
				fmt.Fprintf(w, "input invalid")
			}
		}
	})

	//fmt.Printf("Starting server for testing HTTP POST...\n")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal(err)
	}
}
