function greet(name: string): string {
  return "Hello, " + name;
}

function validate(email: string): boolean {
  if (email.length > 0) {
    return true;
  }
  return false;
}

function processUser(name: string, email: string): void {
  const greeting = greet(name);
  console.log(greeting);
  if (validate(email)) {
    saveUser(name, email);
  }
}

function saveUser(name: string, email: string): void {
  console.log("Saving user:", name, email);
}

function main(): void {
  processUser("Alice", "alice@test.com");
}
