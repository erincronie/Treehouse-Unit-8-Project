const employees = [];
const urlAPI = 'https://randomuser.me/api/?results=12&inc=name,picture,email,location,phone,dob&noinfo&nat=US';
const cards = document.getElementById('cards');

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
        <div class="text-container">
          <h2 class="card__name">${first} ${last}</h2>
          <p class="card__email">${email}</p>
          <p class="card__address">${location.city}</p>
        </div>
      </div>
    `;
  }).join('');

  cards.innerHTML = employeeHTML;
}

function handleError(error) {
  console.error('Error:', error);
}