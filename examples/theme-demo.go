package main

import "fmt"

// Entry point
func main() {
	config := loadConfig()
	validate(config)
	process(config)
}

func loadConfig() Config {
	return Config{
		Name:  "demo",
		Limit: 100,
	}
}

func validate(cfg Config) {
	if cfg.Name == "" {
		panic("empty name")
	}
	if cfg.Limit <= 0 {
		fmt.Println("invalid limit")
		return
	}
}

func process(cfg Config) {
	for i := 0; i < cfg.Limit; i++ {
		item := createItem(i)
		transform(item)
		save(item)
	}
}

func createItem(id int) Item {
	return Item{ID: id}
}

func transform(item Item) Item {
	item.Value = item.ID * 2
	return item
}

func save(item Item) {
	fmt.Printf("Saved: %v\n", item)
}

type Config struct {
	Name  string
	Limit int
}

type Item struct {
	ID    int
	Value int
}
