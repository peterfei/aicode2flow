class App {
    String greet(String name) {
        return "Hello, " + name;
    }

    boolean validate(String email) {
        if (email.length() > 0) {
            return true;
        }
        return false;
    }

    void processUser(String name, String email) {
        String greeting = greet(name);
        System.out.println(greeting);
        if (validate(email)) {
            saveUser(name, email);
        }
    }

    void saveUser(String name, String email) {
        System.out.println("Saving user: " + name + ", " + email);
    }

    public static void main(String[] args) {
        App app = new App();
        app.processUser("Alice", "alice@test.com");
    }
}
