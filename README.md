# cognito

Aim: a Cognito-based setup

* React app with login, logout, register, deregister, forced password update, change password, confirm password,
  enter confirmation code, request re-send confirmation code -- ie, all registration and self-service paraphernalia
  except for MFA and except for federated
* admin scripts to set up identity pools

There are various types of authentication setup which Cognito can support:

* single-tier federated eg from Facebook
* single-tier, with self-registration and self-management
* single-tier, with root grants, self-management and public access
* two-tier, with root registration of admins, admin registration of users, self-management, and no public access
* additional frills with MFA
* additional frills with profile management

The easiest to implement are single-tier federated and single-tier with self-signup and self-management.

The ones of most immediate interest to me involve root grants and no self-signup.

## Root grants, no self-signup

## Two-tier privilege
