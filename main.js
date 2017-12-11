var model = (function () {
  var state = {};
  var getValidationState = function (field) {
    var validity = field.validity;
    var doEmailsMatch = document.getElementById('email').value === document.getElementById('confirmEmail').value;
    var doPasswordsMatch = document.getElementById('password').value === document.getElementById('confirmPassword').value;

    if (field.id === 'confirmEmail' && !doEmailsMatch) {
      return 'E-mail addresses do not match';
    }

    if (field.id === 'confirmPassword' && !doPasswordsMatch) {
      return 'Passwords do not match';
    }

    if (validity.valid) {
      return 'valid';
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
  };

  var disableNativeValidation = function () {
    var form = document.querySelectorAll('.validate');
    var i;

    for (i = 0; i < form.length; i += 1) {
      form[i].setAttribute('novalidate', true);
    }
  };

  var updateState = function (field) {
    var err = model.getValidationState(field);

    model.state[field.id] = {
      id: field.id,
      value: field.value,
      error: err
    };
  };

  return {
    getValidationState: getValidationState,
    disableNativeValidation: disableNativeValidation,
    updateState: updateState,
    state: state
  };
}());

var view = (function () {
  var deleteError = function (field) {
    var id;
    var errorMsg;

    field.classList.remove('error');
    field.removeAttribute('aria-describedby');

    id = field.id || field.name;
    errorMsg = field.form.querySelector('.error-text#error-for-' + id + '');

    errorMsg.parentNode.removeChild(errorMsg);
  };

  var render = function () {
    _.forEach(model.state, function (obj) {
      var errorMsg = document.createElement('li');
      var successMsg = document.createElement('li');
      var currField = document.getElementById(obj.id);
      console.log(model.state.keys);

      if (obj.error !== 'valid') {
        currField.classList.add('error');

        if (!currField.form.querySelector('.error-text#error-for-' + obj.id)) {
          errorMsg.innerHTML = obj.error;
          errorMsg.className = 'error-text';
          errorMsg.id = 'error-for-' + obj.id;
          currField.setAttribute('aria-describedby', 'error-for-' + obj.id);
          currField.parentNode.appendChild(errorMsg);
        }
      } else if (!currField.form.querySelector('.success-text#success-for-' + obj.id)) {
        currField.classList.add('success');
        currField.setAttribute('aria-describedby', 'success-for-' + obj.id);
        successMsg.className = 'success-text';
        successMsg.id = 'success-for-' + obj.id;
        successMsg.insertAdjacentHTML('beforeend', '<span class="fa fa-check-circle aria-hidden="true"></span>');
        currField.parentNode.appendChild(successMsg);
      }
    });
  };

  return {
    render: render,
    deleteError: deleteError
  };
}());

var handlers = (function () {
  var blurListener = function () {
    var validateFields = function (e) {
      var isFormField = e.target.type !== 'submit' && e.target.type !== 'fieldset' && e.target.type !== 'checkbox';

      if (e.target.classList.contains('error')) {
        view.deleteError(e.target);
      }

      if (isFormField) {
        model.updateState(e.target);
      }

      view.render();
    };

    document.addEventListener('blur', validateFields, true);
  };

  var submitListener = function () {
    var validateForm = function (e) {
      var isFormField;
      var hasErrors;
      var fields;
      var i;

      fields = e.target.elements;

      for (i = 0; i < fields.length; i += 1) {
        isFormField = fields[i].type !== 'submit' && fields[i].type !== 'fieldset' && fields[i].type !== 'checkbox';

        if (isFormField) {
          model.updateState(fields[i]);
        }

        if (!hasErrors) {
          hasErrors = fields[i];
        }
      }

      if (hasErrors) {
        e.preventDefault();
        hasErrors.focus();
      }

      view.render();
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

document.addEventListener('DOMContentLoaded', function () {
  model.disableNativeValidation();
  handlers.initListener();
}, false);
