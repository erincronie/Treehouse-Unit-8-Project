const employees = [];
const urlAPI = 'https://randomuser.me/api/?results=12&inc=name,picture,email,location,phone,dob&noinfo&nat=US';
const cards = document.getElementById('cards');
const overlay = document.querySelector(".overlay");
const modalContainer = document.querySelector(".modal");
const modalClose = document.querySelector(".modal__close");

fetchData(urlAPI)
  .then(displayEmployees)
  .catch(handleError);

function fetchData(url) {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => data.results);
}

function displayEmployees(employeeData) {
  employees.push(...employeeData);

  const employeeHTML = employees.map((employee, index) => {
    const { name, email, location, picture } = employee;
    const { first, last } = name;

    return `
      <div class="card" data-index="${index}">
        <img class="card__avatar" src="${picture.large}" />
        <div class="card__text-container">
          <h2 class="card__name">${first} ${last}</h2>
          <p class="card__email">${email}</p>
          <p class="card__address">${location.city}</p>
        </div>
      </div>
    `;
  }).join('');

  cards.innerHTML = employeeHTML;

  // Attach event listener for card clicks after displaying employees
  cards.addEventListener('click', function (event) {
    console.log('Card clicked!');
    const card = event.target.closest('.card');
    if (card) {
      const index = card.dataset.index;
      displayModal(index);
    }
  });
}

function handleError(error) {
  console.error('Error:', error);
}

modalClose.addEventListener('click', function () {
    console.log('Modal close clicked!');
    overlay.classList.add("hidden");
});

function generateModalHTML(employee) {
  let { name, dob, phone, email, location: { city, street, state, postcode }, picture } = employee;
  let date = new Date(dob.date);

  return `
    <img class="avatar" src="${picture.large}" />
    <div class="text-container">
      <h2 class="name">${name.first} ${name.last}</h2>
      <p class="email">${email}</p>
      <p class="address">${city}</p>
      <hr />
      <p>${phone}</p>
      <p class="address">${street}, ${state} ${postcode}</p>
      <p>Birthday: ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}</p>
    </div>
  `;
}

function displayModal(index) {
  const employee = employees[index];
  const modalHTML = generateModalHTML(employee);

  overlay.classList.remove("hidden");
  modalContainer.innerHTML = modalHTML;
}
