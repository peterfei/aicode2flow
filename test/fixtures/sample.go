package main

import "fmt"

func greet(name string) string {
	return "Hello, " + name
}

func validate(email string) bool {
	if len(email) > 0 {
		return true
	}
	return false
}

func processUser(name string, email string) {
	greeting := greet(name)
	fmt.Println(greeting)
	if validate(email) {
		saveUser(name, email)
	}
}

func saveUser(name string, email string) {
	fmt.Println("Saving user:", name, email)
}

func main() {
	processUser("Alice", "alice@test.com")
}
