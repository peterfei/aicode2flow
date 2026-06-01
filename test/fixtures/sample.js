function greet(name) {
  return "Hello, " + name;
}

function validate(email) {
  if (email.length > 0) {
    return true;
  }
  return false;
}

function processUser(name, email) {
  const greeting = greet(name);
  console.log(greeting);
  if (validate(email)) {
    saveUser(name, email);
  }
}

function saveUser(name, email) {
  console.log("Saving user:", name, email);
}

function main() {
  processUser("Alice", "alice@test.com");
}
