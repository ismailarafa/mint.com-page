var model = (function () {
  var isValid = function (field) {
    var validity = field.validity;
    var doPasswordsMatch = document.getElementById('email').value === document.getElementById('confirmEmail').value;
    var doEmailsMatch = document.getElementById('password').value === document.getElementById('confirmPassword').value;

    if (validity.valid) {
      return;
    }

    if (validity.valueMissing) {
      return 'Please fill out this field';
    }

    if (validity.tooShort) {
      if (field.type === 'password') {
        return 'Minimum password length is 8 characters';
      }
    }

    if (validity.patternMismatch) {
      if (field.type === 'password') {
        return 'Passwords must contain a lowercase letter, uppercase letter, number and a symbol \'!@#$%^&*\'';
      } else if (field.type === 'email') {
        return 'Please enter a valid e-mail address';
      }
    }

    if (field.id === 'confirmPassword' && !doPasswordsMatch) {
      return 'Passwords do not match';
    } else if (field.id === 'confirmEmail' && !doEmailsMatch) {
      return 'E-mail addresses provided do not match';
    }
  };

  var disableNativeValidation = function () {
    var form = document.querySelectorAll('.validate');
    var i;

    for (i = 0; i < form.length; i += 1) {
      form[i].setAttribute('novalidate', true);
    }
  };

  return {
    isValid: isValid,
    disableNativeValidation: disableNativeValidation
  };
}());

var view = (function () {
  var drawError = function (field, error) {
    var errorMsg = document.createElement('li');
    var id = field.id || field.name;
    var message;
    field.classList.add('error');

    if (!id) {
      return;
    }

    message = field.form.querySelector('.error-text#error-for-' + id);

    if (!message) {
      errorMsg.className = 'error-text';
      errorMsg.id = 'error-for-' + id;
      errorMsg.innerHTML = error;
    }

    field.setAttribute('aria-describedby', 'error-for-' + id);
    field.parentNode.appendChild(errorMsg);
  };

  var deleteError = function (field) {
    var id;
    var errorMsg;

    field.classList.remove('error');
    field.removeAttribute('aria-describedby');

    id = field.id || field.name;

    if (!id) {
      return;
    }

    errorMsg = field.form.querySelector('.error-text#error-for-' + id + '');

    if (!errorMsg) {
      return;
    }

    errorMsg.parentNode.removeChild(errorMsg);
  };

  return {
    drawError: drawError,
    deleteError: deleteError
  };
}());

var handlers = (function () {
  var blurListener = function () {
    var validateFields = function (e) {
      var error;

      if (!e.target.form.classList.contains('validate')) {
        return;
      }

      error = model.isValid(e.target);

      if (error) {
        view.drawError(e.target, error);
        return;
      }

      view.deleteError(e.target);
    };

    document.addEventListener('blur', validateFields, true);
  };

  var submitListener = function () {
    var validateForm = function (e) {
      var error;
      var hasErrors;
      var fields;
      var i;

      if (!e.target.classList.contains('validate')) {
        return;
      }
      fields = e.target.elements;

      for (i = 0; i < fields.length; i += 1) {
        error = model.isValid(fields[i]);

        if (error) {
          view.drawError(fields[i], error);

          if (!hasErrors) {
            hasErrors = fields[i];
          }
        }
      }

      if (hasErrors) {
        e.preventDefault();
        hasErrors.focus();
      }
    };

    document.addEventListener('submit', validateForm, false);
  };

  var initListener = function () {
    blurListener();
    submitListener();
  };

  return {
    initListener: initListener
  };
}());


model.disableNativeValidation();
handlers.initListener();
