import 'package:amazon_clone/constants/global_variables.dart';
import 'package:flutter/material.dart';

import '../../../constants/error_handling.dart';
import '../../../constants/utils.dart';
import '../../../models/user.dart';
import 'package:http/http.dart' as http;

class AuthService {
  //sign in user

  void signUpUser({
    required BuildContext context,
    required String email,
    required String password,
    required String name,
  }) async {
    try {
      User user = User(
        '',
        name,
        email,
        password,
        '',
        '',
        '',
      );

      http.Response res = await http.post(
        Uri.parse("$uri/api/signup"),
        body: user.toJson(),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
      );

      httpErrorHandle(
        context: context,
        response: res,
        onSuccess: () {
          showSnackBar(
              context, 'Account Created! Login with the same credentials');
        },
      );
    } catch (e) {
      showSnackBar(context, e.toString());
    }
  }
}
