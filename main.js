var model = (function () {
  var isValidEmail = function (val) {
    var emailRegex = /^.+@.+\..+$/;
    if (val) {
      return emailRegex.test(val);
    }
  };

  var isEqual = function (val1, val2) {
    if (val1 === val2) {
      return true;
    }
    return false;
  };

  var isValidPassword = function (val) {
    var passwordRegex = /^(?=.*[\d])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/;
    if (val) {
      return passwordRegex.test(val);
    }
  };

  return {
    isEqual: isEqual,
    isValidEmail: isValidEmail,
    isValidPassword: isValidPassword
  };
}());

var view = (function () {
  var drawError = function (field) {
    var errorMsg = document.createElement('li');
    var deleteError = (function () {
      var errors = document.getElementsByClassName('error');
      var i;

      if (errors.length > 0) {
        for (i = 0; i < errors.length; i += 1) {
          errors[i].parentNode.removeChild(errors[i]);
        }
      }
    }());

    if (field.id === 'email') {
      errorMsg.innerHTML = 'Please input a valid e-mail address';
    } else if (field.id === 'confirmEmail') {
      errorMsg.innerHTML = 'E-mail addresses don\'t match';
    } else if (field.id === 'password') {
      errorMsg.innerHTML = 'Password must be 8 characters and contain at least a number, lowercase letter, uppercase letter, and one of the following symbols \'!@#$%^&*\'';
    } else if (field.id === 'confirmPassword') {
      errorMsg.innerHTML = 'Passwords don\'t match';
    }

    errorMsg.className = 'error';
    field.parentNode.appendChild(errorMsg);
  };

  return {
    drawError: drawError
  };
}());

var handlers = (function () {
  var emailFieldListener = function () {
    var emailField = document.getElementById('email');
    var checkEmail = function () {
      var emailVal = emailField.value;

      if (emailVal !== '' && !model.isValidEmail(emailVal)) {
        view.drawError(emailField);
      }
    };

    emailField.addEventListener('blur', checkEmail);
  };

  var confirmEmailListener = function () {
    var confirmEmailField = document.getElementById('confirmEmail');
    var checkConfirmEmail = function () {
      var confirmEmailVal = confirmEmailField.value;
      var emailVal = document.getElementById('email').value;

      if (confirmEmailField !== '' && !model.isEqual(confirmEmailVal, emailVal)) {
        view.drawError(confirmEmailField);
      }
    };

    confirmEmailField.addEventListener('blur', checkConfirmEmail);
  };

  var passwordFieldListener = function () {
    var passwordField = document.getElementById('password');
    var checkPassword = function () {
      var passwordVal = passwordField.value;

      if (passwordVal !== '' && !model.isValidPassword(passwordVal)) {
        view.drawError(passwordField);
      }
    };

    passwordField.addEventListener('blur', checkPassword);
  };

  var confirmPasswordListener = function () {
    var confirmPasswordField = document.getElementById('confirmPassword');
    var confirmPassword = function () {
      var confirmPasswordVal = confirmPasswordField.value;
      var passwordVal = document.getElementById('password').value;

      if (confirmPasswordVal !== '' && !model.isEqual(confirmPasswordVal, passwordVal)) {
        view.drawError(confirmPasswordField);
      }
    };

    confirmPasswordField.addEventListener('blur', confirmPassword);
  };

  var formSubmitListener = function (e) {
    var btn = document.getElementById('btn');
    var checkForm = function () {
      var emailField = document.getElementById('email');
      var confirmEmailField = document.getElementById('confirmEmail');
      var passwordField = document.getElementById('password');
      var confirmPasswordField = document.getElementById('confirmPassword');
      e.preventDefault();

      if (emailField.value !== '' && !model.isValidEmail(emailField.value)) {
        view.drawError(emailField);
      } else if (confirmEmailField.value !== '' && !model.isEqual(emailField.value, confirmEmailField.value)) {
        view.drawError(confirmEmailField);
      } else if (passwordField.value !== '' && !model.isValidPassword(passwordField.value)) {
        view.drawError(passwordField);
      } else if (confirmPasswordField.value !== '' && !model.isEqual(confirmPasswordField.value, passwordField.value)) {
        view.drawError(confirmPasswordField);
      }
    };

    btn.addEventListener('click', checkForm);
  };

  var initListener = function () {
    emailFieldListener();
    confirmEmailListener();
    passwordFieldListener();
    confirmPasswordListener();
    formSubmitListener();
  };

  return {
    emailFieldListener: emailFieldListener,
    confirmEmailListener: confirmEmailListener,
    passwordFieldListener: passwordFieldListener,
    confirmPasswordListener: confirmPasswordListener,
    initListener: initListener
  };
}());

handlers.initListener();
