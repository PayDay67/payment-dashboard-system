import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/payment.dart';
import '../services/payment_service.dart';

class TransactionsScreen extends StatefulWidget {
  @override
  _TransactionsScreenState createState() => _TransactionsScreenState();
}

class _TransactionsScreenState extends State<TransactionsScreen> {
  final PaymentService _paymentService = PaymentService();
  List<Payment> _payments = [];
  bool _isLoading = true;
  int _currentPage = 1;
  int _totalPages = 1;
  String? _selectedStatus;
  String? _selectedMethod;

  @override
  void initState() {
    super.initState();
    _loadPayments();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Transactions'),
        actions: [
          IconButton(
            icon: Icon(Icons.filter_list),
            onPressed: _showFilterDialog,
          ),
        ],
      ),
      body: Column(
        children: [
          if (_selectedStatus != null || _selectedMethod != null)
            Container(
              padding: EdgeInsets.all(8),
              color: Colors.grey[200],
              child: Row(
                children: [
                  Text('Filters: '),
                  if (_selectedStatus != null)
                    Chip(
                      label: Text('Status: $_selectedStatus'),
                      onDeleted: () => _clearFilter('status'),
                    ),
                  if (_selectedMethod != null)
                    Chip(
                      label: Text('Method: $_selectedMethod'),
                      onDeleted: () => _clearFilter('method'),
                    ),
                ],
              ),
            ),
          Expanded(
            child: _isLoading
                ? Center(child: CircularProgressIndicator())
                : ListView.builder(
                    itemCount: _payments.length,
                    itemBuilder: (context, index) {
                      final payment = _payments[index];
                      return Card(
                        margin: EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                        child: ListTile(
                          leading: CircleAvatar(
                            backgroundColor: _getStatusColor(payment.status),
                            child: Icon(
                              _getStatusIcon(payment.status),
                              color: Colors.white,
                            ),
                          ),
                          title: Text('\$${payment.amount.toStringAsFixed(2)}'),
                          subtitle: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('To: ${payment.receiver}'),
                              Text('${payment.method} • ${DateFormat('MMM dd, yyyy').format(payment.createdAt)}'),
                            ],
                          ),
                          trailing: Chip(
                            label: Text(payment.status.toUpperCase()),
                            backgroundColor: _getStatusColor(payment.status).withOpacity(0.2),
                          ),
                          onTap: () => _showPaymentDetails(payment),
                        ),
                      );
                    },
                  ),
          ),
          if (_totalPages > 1) _buildPagination(),
        ],
      ),
    );
  }

  Widget _buildPagination() {
    return Container(
      padding: EdgeInsets.all(16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          IconButton(
            onPressed: _currentPage > 1 ? () => _changePage(_currentPage - 1) : null,
            icon: Icon(Icons.chevron_left),
          ),
          Text('$_currentPage of $_totalPages'),
          IconButton(
            onPressed: _currentPage < _totalPages ? () => _changePage(_currentPage + 1) : null,
            icon: Icon(Icons.chevron_right),
          ),
        ],
      ),
    );
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'success': return Colors.green;
      case 'failed': return Colors.red;
      case 'pending': return Colors.orange;
      default: return Colors.grey;
    }
  }

  IconData _getStatusIcon(String status) {
    switch (status) {
      case 'success': return Icons.check;
      case 'failed': return Icons.close;
      case 'pending': return Icons.schedule;
      default: return Icons.help;
    }
  }

  Future<void> _loadPayments() async {
    setState(() => _isLoading = true);
    
    final result = await _paymentService.getPayments(
      page: _currentPage,
      status: _selectedStatus,
      method: _selectedMethod,
    );

    if (result != null) {
      setState(() {
        _payments = result['payments'];
        _totalPages = (result['total'] / 10).ceil();
        _isLoading = false;
      });
    }
  }

  void _changePage(int page) {
    setState(() => _currentPage = page);
    _loadPayments();
  }

  void _showFilterDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Filter Transactions'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            DropdownButtonFormField<String>(
              value: _selectedStatus,
              decoration: InputDecoration(labelText: 'Status'),
              items: ['success', 'failed', 'pending']
                  .map((s) => DropdownMenuItem(value: s, child: Text(s)))
                  .toList(),
              onChanged: (value) => setState(() => _selectedStatus = value),
            ),
            DropdownButtonFormField<String>(
              value: _selectedMethod,
              decoration: InputDecoration(labelText: 'Method'),
              items: ['credit_card', 'debit_card', 'paypal', 'bank_transfer']
                  .map((m) => DropdownMenuItem(value: m, child: Text(m)))
                  .toList(),
              onChanged: (value) => setState(() => _selectedMethod = value),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              _loadPayments();
            },
            child: Text('Apply'),
          ),
        ],
      ),
    );
  }

  void _clearFilter(String type) {
    setState(() {
      if (type == 'status') _selectedStatus = null;
      if (type == 'method') _selectedMethod = null;
    });
    _loadPayments();
  }

  void _showPaymentDetails(Payment payment) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Payment Details'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Transaction ID: ${payment.transactionId}'),
            Text('Amount: \$${payment.amount.toStringAsFixed(2)}'),
            Text('Method: ${payment.method}'),
            Text('Receiver: ${payment.receiver}'),
            Text('Status: ${payment.status}'),
            if (payment.description != null)
              Text('Description: ${payment.description}'),
            Text('Date: ${DateFormat('MMM dd, yyyy HH:mm').format(payment.createdAt)}'),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('Close'),
          ),
        ],
      ),
    );
  }
}