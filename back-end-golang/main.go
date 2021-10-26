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
	"github.com/rs/cors"
)

/* global variable declaration */
var invalidInputErr string = "input invalid(maybe key is not at least 8 char)"

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
		return invalidInputErr
	}
}

func main() {
	client := redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "", // no password set
		DB:       0,  // use default DB
	})

	mux := http.NewServeMux()
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		if r.Method == "OPTIONS" {
			w.Header().Set("Access-Control-Allow-Headers", "Authorization") // You can add more headers here if needed
		} else {
			if r.URL.Path != "/sha256" {
				http.Error(w, "404 not found.", http.StatusNotFound)
				return
			}

			switch r.Method {
			case "GET":
				query := r.URL.Query()
				/*
					"hashedString" is the name of Frontend query for finding a key base on its hash
					for example "http://localhost:8080/sha256?hashedString=68c5f75d96a3e0ef04e368ccf8158bbc37967c2c"
				*/
				hashedString, present := query["hashedString"]
				if !present || len(hashedString) == 0 {
					fmt.Println("hashedString not present")
				}
				// result := GetData(*client, hashedString[0])
				key := hashedString[0]

				val2, err2 := client.Get(ctx, key).Result()

				w.WriteHeader(http.StatusCreated)
				w.Header().Set("Content-Type", "application/json")
				resp := make(map[string]string)

				if err2 != nil {
					resp["value"] = "0"
					resp["str"] = "not valid string"

				} else {
					result := val2
					resp["value"] = "1"
					resp["str"] = result
				}
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
					curl "http://localhost:8080/sha256" -X POST -d "str=mohammadreza"
					in commandLine
				*/
				value := r.FormValue("str")
				result := SetNewData(*client, value)
				if result != invalidInputErr {
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
					fmt.Fprintf(w, invalidInputErr)
				}
			default:
				fmt.Println("ERROR (not Post nor Get)")
			}
		}

	})

	handler := cors.Default().Handler(mux)

	if err := http.ListenAndServe(":8080", handler); err != nil {
		log.Fatal(err)
	}
}
