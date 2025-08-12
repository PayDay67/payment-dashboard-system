import 'package:flutter/material.dart';
import '../services/payment_service.dart';

class AddPaymentScreen extends StatefulWidget {
  @override
  _AddPaymentScreenState createState() => _AddPaymentScreenState();
}

class _AddPaymentScreenState extends State<AddPaymentScreen> {
  final _formKey = GlobalKey<FormState>();
  final _amountController = TextEditingController();
  final _receiverController = TextEditingController();
  final _descriptionController = TextEditingController();
  final PaymentService _paymentService = PaymentService();
  
  String _selectedMethod = 'credit_card';
  String _selectedStatus = 'success';
  bool _isLoading = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Add Payment'),
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: EdgeInsets.all(16),
          children: [
            TextFormField(
              controller: _amountController,
              decoration: InputDecoration(
                labelText: 'Amount',
                prefixText: '\$',
                border: OutlineInputBorder(),
              ),
              keyboardType: TextInputType.numberWithOptions(decimal: true),
              validator: (value) {
                if (value?.isEmpty == true) return 'Required';
                if (double.tryParse(value!) == null) return 'Invalid amount';
                return null;
              },
            ),
            SizedBox(height: 16),
            DropdownButtonFormField<String>(
              value: _selectedMethod,
              decoration: InputDecoration(
                labelText: 'Payment Method',
                border: OutlineInputBorder(),
              ),
              items: [
                DropdownMenuItem(value: 'credit_card', child: Text('Credit Card')),
                DropdownMenuItem(value: 'debit_card', child: Text('Debit Card')),
                DropdownMenuItem(value: 'paypal', child: Text('PayPal')),
                DropdownMenuItem(value: 'bank_transfer', child: Text('Bank Transfer')),
              ],
              onChanged: (value) => setState(() => _selectedMethod = value!),
            ),
            SizedBox(height: 16),
            TextFormField(
              controller: _receiverController,
              decoration: InputDecoration(
                labelText: 'Receiver',
                border: OutlineInputBorder(),
              ),
              validator: (value) => value?.isEmpty == true ? 'Required' : null,
            ),
            SizedBox(height: 16),
            DropdownButtonFormField<String>(
              value: _selectedStatus,
              decoration: InputDecoration(
                labelText: 'Status (Simulation)',
                border: OutlineInputBorder(),
              ),
              items: [
                DropdownMenuItem(value: 'success', child: Text('Success')),
                DropdownMenuItem(value: 'failed', child: Text('Failed')),
                DropdownMenuItem(value: 'pending', child: Text('Pending')),
              ],
              onChanged: (value) => setState(() => _selectedStatus = value!),
            ),
            SizedBox(height: 16),
            TextFormField(
              controller: _descriptionController,
              decoration: InputDecoration(
                labelText: 'Description (Optional)',
                border: OutlineInputBorder(),
              ),
              maxLines: 3,
            ),
            SizedBox(height: 24),
            ElevatedButton(
              onPressed: _isLoading ? null : _submitPayment,
              child: _isLoading
                  ? CircularProgressIndicator()
                  : Text('Create Payment'),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _submitPayment() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    final paymentData = {
      'amount': double.parse(_amountController.text),
      'method': _selectedMethod,
      'receiver': _receiverController.text,
      'status': _selectedStatus,
      'description': _descriptionController.text.isEmpty 
          ? null 
          : _descriptionController.text,
    };

    final result = await _paymentService.createPayment(paymentData);

    setState(() => _isLoading = false);

    if (result != null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Payment created successfully')),
      );
      Navigator.pop(context);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to create payment')),
      );
    }
  }
}