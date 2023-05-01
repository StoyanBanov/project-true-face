const submitInp = document.querySelector('form > input')
submitInp.disabled = true
const requirementsArr = [...document.querySelectorAll('form > div > div :nth-child(3)')]
const requirementsObj = {
    username: ['5-20 characters', 'only english letters and/or digits'],
    email: ['8-30 characters'],
    password: ['10-30 characters', 'only english letters', 'at least 1 digit', 'at least one special character'],
    rePassword: ['the same as the password']
}

const inputsObj = [...document.querySelectorAll('form > div > div > input')].reduce((obj, inp, i) => {
    inp.value = inp.value.trim()
    obj[inp.name] = { input: inp, label: requirementsArr[i] }
    if (i < 3) requirementsArr[i].textContent = `(${requirementsObj[inp.name].join(', ')})`
    return obj
}, {})

Object.values(inputsObj).forEach(i => {
    i.input.addEventListener('keyup', validateInputs)
});

function validateInputs({ target }) {
    const currentRequirements = []
    if (target == inputsObj.username.input) {
        if (target.value.length < 5 || target.value.length > 20) currentRequirements.push(requirementsObj.username[0])
        if (!/^[a-zA-Z0-9]+$/.test(target.value)) currentRequirements.push(requirementsObj.username[1])
        inputsObj.username.label.textContent = currentRequirements.length > 0 ? `(${currentRequirements.join(', ')})` : ''
    }
    else if (target == inputsObj.email.input) {
        inputsObj.email.label.textContent = target.value.length < 8 || target.value.length > 30 ? `(${requirementsObj.email.join(', ')})` : ''
    }
    else if (target == inputsObj.password.input) {
        if (target.value.length < 10 || target.value.length > 30) currentRequirements.push(requirementsObj.password[0])
        if (!/^[a-zA-Z0-9!@#$%^&*()_+]+$/.test(target.value)) currentRequirements.push(requirementsObj.password[1])
        if (!/[0-9]+/.test(target.value)) currentRequirements.push(requirementsObj.password[2])
        if (!/[!@#$%^&*()_+]+/.test(target.value)) currentRequirements.push(requirementsObj.password[3])
        inputsObj.password.label.textContent = currentRequirements.length > 0 ? `(${currentRequirements.join(', ')})` : ''
    }
    inputsObj.rePassword.label.textContent = inputsObj.rePassword.input.value != inputsObj.password.input.value ? `(${requirementsObj.rePassword.join(', ')})` : ''
    if (requirementsArr.every(l => l.textContent == '')) submitInp.disabled = false
    else true
}