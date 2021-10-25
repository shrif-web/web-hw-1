import axios from "axios";

const host = "http://localhost:4000";

export const makePostRequest = (path, data) => {
  return axios.post(host + path, data);
};

export const fetchUserEvents = async (path) => {
  let events = [];
  axios.get(host + path).then((res) => {
    res.data.courses.forEach((course) => {
      course.events.forEach((event) => {
        events.push({
          title: `${course.title}-${event.description}`,
          date: event.time.slice(0, 11),
          color:
            event.priority === 0
              ? "green"
              : event.priority === 1
              ? "orange"
              : "red",
        });
        console.log(events);
      });
    });

    return events;
  });
};

export const fetchCoursesData = async (path) => {
  let courses = [];
  await axios.get(host + path).then((res) => {
    res.data.courses.forEach((element) => {
      courses.push({
        title: element.title,
        id: element.id,
      });
      console.log(courses);
    });
  });
  return courses;
};

export const addCourseRequest = (path, course_id) => {
  axios.put(host + path, { course_id });
};