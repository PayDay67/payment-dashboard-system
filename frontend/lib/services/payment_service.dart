import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/payment.dart';
import 'auth_service.dart';

class PaymentService {
  static const String baseUrl = 'http://localhost:3001';
  final AuthService _authService = AuthService();

  Future<Map<String, String>> _getHeaders() async {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  Future<Map<String, dynamic>?> getPayments({
    int page = 1,
    int limit = 10,
    String? status,
    String? method,
    String? startDate,
    String? endDate,
  }) async {
    try {
      print('🔄 Fetching payments...');
      final queryParams = <String, String>{
        'page': page.toString(),
        'limit': limit.toString(),
      };
      
      if (status != null) queryParams['status'] = status;
      if (method != null) queryParams['method'] = method;
      if (startDate != null) queryParams['startDate'] = startDate;
      if (endDate != null) queryParams['endDate'] = endDate;

      final uri = Uri.parse('$baseUrl/payments').replace(queryParameters: queryParams);
      final headers = await _getHeaders();
      print('📡 Request URL: $uri');
      print('📡 Headers: $headers');
      
      final response = await http.get(uri, headers: headers);
      print('📡 Response status: ${response.statusCode}');
      print('📡 Response body: ${response.body}');

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return {
          'payments': (data['payments'] as List).map((p) => Payment.fromJson(p)).toList(),
          'total': data['total'],
        };
      }
      return null;
    } catch (e) {
      print('❌ Get payments error: $e');
      return null;
    }
  }

  Future<Payment?> getPayment(String id) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/payments/$id'),
        headers: await _getHeaders(),
      );

      if (response.statusCode == 200) {
        return Payment.fromJson(jsonDecode(response.body));
      }
      return null;
    } catch (e) {
      print('Get payment error: $e');
      return null;
    }
  }

  Future<Payment?> createPayment(Map<String, dynamic> paymentData) async {
    try {
      print('🔄 Creating payment: $paymentData');
      final headers = await _getHeaders();
      final response = await http.post(
        Uri.parse('$baseUrl/payments'),
        headers: headers,
        body: jsonEncode(paymentData),
      );

      print('📡 Create payment status: ${response.statusCode}');
      print('📡 Create payment response: ${response.body}');

      if (response.statusCode == 201 || response.statusCode == 200) {
        return Payment.fromJson(jsonDecode(response.body));
      }
      return null;
    } catch (e) {
      print('❌ Create payment error: $e');
      return null;
    }
  }

  Future<Map<String, dynamic>?> getStats() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/payments/stats'),
        headers: await _getHeaders(),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      return null;
    } catch (e) {
      print('Get stats error: $e');
      return null;
    }
  }
}