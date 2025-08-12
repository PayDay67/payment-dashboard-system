class Payment {
  final String id;
  final double amount;
  final String method;
  final String receiver;
  final String status;
  final String? description;
  final String transactionId;
  final DateTime createdAt;

  Payment({
    required this.id,
    required this.amount,
    required this.method,
    required this.receiver,
    required this.status,
    this.description,
    required this.transactionId,
    required this.createdAt,
  });

  factory Payment.fromJson(Map<String, dynamic> json) {
    return Payment(
      id: json['_id'],
      amount: json['amount'].toDouble(),
      method: json['method'],
      receiver: json['receiver'],
      status: json['status'],
      description: json['description'],
      transactionId: json['transactionId'],
      createdAt: DateTime.parse(json['createdAt']),
    );
  }
}