class User {
  final String id;
  final String username;
  final String role;
  final String email;

  User({
    required this.id,
    required this.username,
    required this.role,
    required this.email,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      username: json['username'],
      role: json['role'],
      email: json['email'],
    );
  }
}