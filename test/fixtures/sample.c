#include <stdio.h>
#include <stdbool.h>
#include <string.h>

char* greet(char* name) {
    static char buffer[100];
    sprintf(buffer, "Hello, %s", name);
    return buffer;
}

bool validate(char* email) {
    if (strlen(email) > 0) {
        return true;
    }
    return false;
}

void processUser(char* name, char* email) {
    char* greeting = greet(name);
    printf("%s\n", greeting);
    if (validate(email)) {
        saveUser(name, email);
    }
}

void saveUser(char* name, char* email) {
    printf("Saving user: %s, %s\n", name, email);
}

int main() {
    processUser("Alice", "alice@test.com");
    return 0;
}
