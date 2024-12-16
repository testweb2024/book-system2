document.addEventListener('DOMContentLoaded', () => {
    const bookForm = document.getElementById('book-form');
    const bookList = document.getElementById('book-list');
    const clearAllBtn = document.querySelector('.btn-warning');
    const logoutBtn = document.getElementById('logout-btn');

    // Load books from LocalStorage on page load
    const loadBooks = () => {
        const books = JSON.parse(localStorage.getItem('books')) || [];
        books.forEach((book) => addBookToTable(book));
    };

    // Save books to LocalStorage
    const saveBooks = () => {
        const books = [];
        const rows = bookList.querySelectorAll('tr');
        rows.forEach((row) => {
            const cells = row.querySelectorAll('td');
            const book = {
                title: cells[0].textContent,
                author: cells[1].textContent,
                year: cells[2].textContent,
                quantity: cells[3].textContent,
            };
            books.push(book);
        });
        localStorage.setItem('books', JSON.stringify(books));
    };

    // Add a book to the table
    const addBookToTable = (book) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.year}</td>
            <td>${book.quantity}</td>
            <td>
                
                <button class="btn btn-primary btn-sm edit-btn">Edit</button>
                <button class="btn btn-danger btn-sm delete-btn">Delete</button>
            </td>
        `;
        bookList.appendChild(row);
    };

    // Add new book
    bookForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const title = document.getElementById('bookTitle').value;
        const author = document.getElementById('bookAuthor').value;
        const year = document.getElementById('bookYear').value;
        const quantity = document.getElementById('bookQuanity').value;

        if (title && author && year && quantity) {
            const book = { title, author, year, quantity };
            addBookToTable(book);
            saveBooks(); // Save to LocalStorage
            bookForm.reset(); // Clear the form
        }
    });

    // Handle actions for Edit, Review, and Delete
    bookList.addEventListener('click', (event) => {
        const target = event.target;

        // Delete book
        if (target.classList.contains('delete-btn')) {
            const row = target.closest('tr');
            row.remove();
            saveBooks(); // Save updated list to LocalStorage
        }

        // Edit book
        if (target.classList.contains('edit-btn')) {
            const row = target.closest('tr');
            const cells = row.querySelectorAll('td');

            Swal.fire({
                title: 'Edit Book Details',
                html: `
                    <div>
                        <label>Title:</label><br>
                        <input id="editTitle" class="swal2-input" value="${cells[0].textContent}"><br>
                        <label>Author:</label><br>
                        <input id="editAuthor" class="swal2-input" value="${cells[1].textContent}"><br>
                        <label>Year:</label><br>
                        <input id="editYear" class="swal2-input" type="number" value="${cells[2].textContent}"><br>
                        <label>Quantity:</label><br>
                        <input id="editQuantity" class="swal2-input" type="number" value="${cells[3].textContent}"><br>
                    </div>
                `,
                confirmButtonText: 'Save Changes',
                showCancelButton: true,
                cancelButtonText: 'Cancel',
                preConfirm: () => {
                    const editedTitle = document.getElementById('editTitle').value;
                    const editedAuthor = document.getElementById('editAuthor').value;
                    const editedYear = document.getElementById('editYear').value;
                    const editedQuantity = document.getElementById('editQuantity').value;

                    if (!editedTitle || !editedAuthor || !editedYear || !editedQuantity) {
                        Swal.showValidationMessage('All fields are required!');
                        return null;
                    }

                    return { editedTitle, editedAuthor, editedYear, editedQuantity };
                },
            }).then((result) => {
                if (result.isConfirmed) {
                    const { editedTitle, editedAuthor, editedYear, editedQuantity } = result.value;

                    // Update the table row with the edited data
                    cells[0].textContent = editedTitle;
                    cells[1].textContent = editedAuthor;
                    cells[2].textContent = editedYear;
                    cells[3].textContent = editedQuantity;

                    saveBooks(); // Save updated list to LocalStorage
                    Swal.fire('Updated!', 'The book details have been updated.', 'success');
                }
            });
        }
    });
    //Search for Books
    // Search for Books
const searchForm = document.getElementById('search-form');
const searchButton = document.getElementById('searchButton');

searchButton.addEventListener('click', () => {
    const title = document.getElementById('searchTitle').value.toLowerCase();
    const author = document.getElementById('searchAuthor').value.toLowerCase();
    const year = document.getElementById('searchYear').value;
    const quantity = document.getElementById('searchQuanity').value;

    const rows = bookList.querySelectorAll('tr');
    rows.forEach((row) => {
        const cells = row.querySelectorAll('td');
        const bookTitle = cells[0].textContent.toLowerCase();
        const bookAuthor = cells[1].textContent.toLowerCase();
        const bookYear = cells[2].textContent;
        const bookQuantity = cells[3].textContent;

        const matchesTitle = title === "" || bookTitle.includes(title);
        const matchesAuthor = author === "" || bookAuthor.includes(author);
        const matchesYear = year === "" || bookYear === year;
        const matchesQuantity = quantity === "" || bookQuantity === quantity;

        // Show or hide rows based on the search criteria
        if (matchesTitle && matchesAuthor && matchesYear && matchesQuantity) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
});

// Reset the search filters
searchForm.addEventListener('reset', () => {
    const rows = bookList.querySelectorAll('tr');
    rows.forEach((row) => {
        row.style.display = ''; // Show all rows
    });
});


    // Clear all form fields
    clearAllBtn.addEventListener('click', () => {
        document.getElementById('bookTitle').value = '';
        document.getElementById('bookAuthor').value = '';
        document.getElementById('bookYear').value = '';
        document.getElementById('bookQuanity').value = '';
    });

    // Logout button functionality
    logoutBtn.addEventListener('click', () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You will be logged out!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Log Out',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire('Logged Out', 'You have successfully logged out.', 'success').then(() => {
                    window.location.href = '/Users/mac/Documents/ITE206k web javascript/project book manegement/index1.html'; // Redirect to another file
                });
            }
        });
    });

    // Load books when the page is loaded
    loadBooks();
});

