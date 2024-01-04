document.addEventListener('DOMContentLoaded', function() {
    const employees = [];
    const urlAPI = 'https://randomuser.me/api/?results=12&inc=name,picture,email,location,phone,dob&noinfo&nat=US';
    const cards = document.getElementById('cards');
    const overlay = document.querySelector(".overlay");
    const modalContainer = document.querySelector(".modal__content");
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

        cards.addEventListener('click', function (event) {
            const card = event.target.closest('.card');
            if (card) {
                const index = card.dataset.index;
                displayModal(index);
            }
        });
    }

    function handleError(error) {
        console.error('Error:', error.message);
    }

    modalClose.addEventListener('click', function () {
        overlay.classList.add("hidden");
    });

    function generateModalHTML(employee) {
        let { name, dob, phone, email, location: { street, city, state, postcode }, picture } = employee;
        let date = new Date(dob.date);

        return `
            <img class="modal__avatar" src="${picture.large}" />
            <div class="modal__text-container">
                <h2 class="modal__name">${name.first} ${name.last}</h2>
                <p class="modal__email">${email}</p>
                <p class="modal__address">${city}</p>
                <hr />
                <p class="modal__phone">${phone}</p>
                <p class="modal__address">${street.number} ${street.name}, ${state} ${postcode}</p>
                <p class="modal__birthday">Birthday: ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}</p>
            </div>
        `;
    }

    function displayModal(index) {
        const employee = employees[index];
        const modalHTML = generateModalHTML(employee);

        overlay.classList.remove("hidden");
        modalContainer.innerHTML = modalHTML;
    }
});
