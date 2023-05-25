function deleteMovie(movieID) {
    fetch(`/movies/${movieID}`, { method: 'DELETE' })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok ${response.statusText}`);
            }
            window.location.reload(true);  // refresh the page
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}