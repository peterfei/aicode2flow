#include <iostream>
#include <string>

std::string greet(const std::string& name) {
    return "Hello, " + name;
}

bool validate(const std::string& email) {
    if (email.length() > 0) {
        return true;
    }
    return false;
}

void processUser(const std::string& name, const std::string& email) {
    std::string greeting = greet(name);
    std::cout << greeting << std::endl;
    if (validate(email)) {
        saveUser(name, email);
    }
}

void saveUser(const std::string& name, const std::string& email) {
    std::cout << "Saving user: " << name << ", " << email << std::endl;
}

int main() {
    processUser("Alice", "alice@test.com");
    return 0;
}
