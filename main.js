document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');

    if (window.location.pathname.includes('index.html')) {
        // Login Page
        const loginForm = document.getElementById('loginForm');

        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const requestBody = {
                email: 'eve.holt@reqres.in',
                password: password,
            };

            fetch('https://reqres.in/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    window.location.href = 'employee.html';
                } else {
                    alert('Login failed. Please check your credentials.');
                }
            })
            .catch(error => {
                console.error('Error during login:', error);
                alert('An error occurred during login.');
            });
        });
    } else if (window.location.pathname.includes('employee.html')) {
        // Employee Page
        if (!token) {
            window.location.href = 'index.html';
        } else {
            fetchEmployeeData(token);
        }
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const itemsPerPage = 6;
    let currentPage = 1;

    // Fetch and render employee data on page load
    fetchEmployeeData(currentPage);

    function fetchEmployeeData(page) {
        fetch(`https://dbioz2ek0e.execute-api.ap-south-1.amazonaws.com/mockapi/get-employees?page=${page}&limit=${itemsPerPage}`)
            .then(response => response.json())
            .then(data => {
                renderEmployeeData(data.data);
                renderPagination(data.totalPages);
            })
            .catch(error => {
                console.error('Error fetching employee data:', error);
                alert('An error occurred while fetching employee data.');
            });
    }

    function renderEmployeeData(employeeData) {
        const employeeContainer = document.getElementById('employeeContainer');
        employeeContainer.innerHTML = '';

        employeeData.forEach(employee => {
            const card = document.createElement('div');
            card.classList.add('employee-card');

            card.innerHTML = `
                <img src="${employee.image}" alt="${employee.name}">
                <h3>${employee.name}</h3>
                <p>Gender: ${employee.gender}</p>
                <p>Department: ${employee.department}</p>
                <p>Salary: ${employee.salary}</p>
            `;

            employeeContainer.appendChild(card);
        });
    }

    function renderPagination(totalPages) {
        const paginationContainer = document.getElementById('pagination');
        paginationContainer.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.innerText = i;
            button.addEventListener('click', function () {
                currentPage = i;
                fetchEmployeeData(currentPage);
            });

            if (i === currentPage) {
                button.classList.add('active');
            }

            paginationContainer.appendChild(button);
        }
    }
});