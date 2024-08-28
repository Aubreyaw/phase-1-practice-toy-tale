let addToy = false; 
const heartGlyph = "\u2665"; 
const toyURL = "http://localhost:3000/toys"; 

document.addEventListener("DOMContentLoaded", () => {  
    const addBtn = document.querySelector("#new-toy-btn");  
    const toyFormContainer = document.querySelector(".container"); 
    const imgContainer = document.getElementById("toy-collection"); 
    const toyForm = document.querySelector(".add-toy-form");

    addBtn.addEventListener("click", () => {
        addToy = !addToy; 
        toyFormContainer.style.display = addToy ? "block" : "none";
    });

    function fetchToys() {  
        fetch(toyURL) 
        .then(response => response.json()) 
        .then(data => {  
            data.forEach(toy => {  
                const cardDiv = document.createElement("div"); 
                cardDiv.className = "card";                    

                const toyName = document.createElement("h2");              
                toyName.textContent = toy.name;
                cardDiv.appendChild(toyName);  

                const toyImg = document.createElement("img");  
                toyImg.src = toy.image;  
                toyImg.classList.add("toy-avatar"); 
                cardDiv.appendChild(toyImg); 
               
                const toyLikes = document.createElement("p"); 
                toyLikes.textContent = `${toy.likes} Likes`; 
                cardDiv.appendChild(toyLikes); 

                const toyLikeBtn = document.createElement("button"); 
                toyLikeBtn.className = "like-btn"; 
                toyLikeBtn.id = toy.id; 
                toyLikeBtn.textContent = `Like ${heartGlyph}`; 
                cardDiv.appendChild(toyLikeBtn); 

                imgContainer.appendChild(cardDiv);  
            });
        })
        .catch(error => console.error("Toy fetch error:", error));
    }

    toyForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const toyName = event.target.name.value;
        const toyImage = event.target.image.value;

        const formData = {
            name: toyName,
            image: toyImage,
            likes: 0
        }; 

        fetch(toyURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(newToy => {
            const cardDiv = document.createElement("div");
            cardDiv.className = "card";
       
            const toyName = document.createElement("h2");
              toyName.textContent = newToy.name;  
              cardDiv.appendChild(toyName);
       
            const toyImg = document.createElement("img");
              toyImg.src = newToy.image;
              toyImg.classList.add("toy-avatar");
              cardDiv.appendChild(toyImg);
        
            const toyLikes = document.createElement("p");
              toyLikes.textContent = `${newToy.likes} Likes`;
              cardDiv.appendChild(toyLikes);
          
            const toyLikeBtn = document.createElement("button");
              toyLikeBtn.className = "like-btn";
              toyLikeBtn.id = newToy.id;
              toyLikeBtn.textContent = `Like ${heartGlyph}`;
              cardDiv.appendChild(toyLikeBtn);

            imgContainer.appendChild(cardDiv);
        })
        .catch(error => console.error("Toy creation error:", error));
    });
 
        imgContainer.addEventListener("click", (event) => {
          if (event.target.classList.contains("like-btn")) {
            console.log("Like clicked!", event.target.id); 

            const toyId = event.target.id;
              console.log("Toy ID:", toyId);
              const toyLikesElement = event.target.previousElementSibling; // The <p> tag with the number of likes
              const currentLikes = parseInt(toyLikesElement.textContent);
              const newNumberOfLikes = currentLikes + 1;

              fetch(`${toyURL}/${toyId}`, {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                  "Accept": "application/json"
                },
                body: JSON.stringify({
                  likes: newNumberOfLikes
                })
              })
              .then(response => response.json())
              .then(updatedToy => {
                toyLikesElement.textContent = `${updatedToy.likes} Likes`
              })
              .catch(error => console.error("Toy update error", error));
            }
  });
    fetchToys();  
});

