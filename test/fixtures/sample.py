def greet(name):
    return "Hello, " + name


def validate(email):
    if len(email) > 0:
        return True
    return False


def process_user(name, email):
    greeting = greet(name)
    print(greeting)
    if validate(email):
        save_user(name, email)


def save_user(name, email):
    print(f"Saving user: {name}, {email}")


def main():
    process_user("Alice", "alice@test.com")


if __name__ == "__main__":
    main()
