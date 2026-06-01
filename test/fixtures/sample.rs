fn greet(name: &str) -> String {
    format!("Hello, {}", name)
}

fn validate(email: &str) -> bool {
    if email.len() > 0 {
        return true;
    }
    false
}

fn process_user(name: &str, email: &str) {
    let greeting = greet(name);
    println!("{}", greeting);
    if validate(email) {
        save_user(name, email);
    }
}

fn save_user(name: &str, email: &str) {
    println!("Saving user: {}, {}", name, email);
}

fn main() {
    process_user("Alice", "alice@test.com");
}
