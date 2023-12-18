const generateForm = document.querySelector(".generate-form");
const imageGallery = document.querySelector(".image-gallery");

const OPENAI_API_KEY = "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";

const updateImageCard = (imgDataArray) => {
    imgDataArray.forEach((imgObject, index) => {
        const imgCard = imageGallery.querySelectorAll(".img-card")[index];
        const imgElement = imgCard.querySelector("img");
        const downloadBtn = imgCard.querySelector(".download-btn")

        //Sets the image source to the ai generated image data and set download attributes
        const aiGeneratedImg = `data:image/jpeg;base64,${imgObject.b64_json}`;
        imgElement.src = aiGeneratedImg;

        imgElement.onload = () => {
            imgCard.classList.remove("loading");
            downloadBtn.setAttribute("href", aiGeneratedImg);
            downloadBtn.setAttribute("download", `${new DataTransfer().getTime()}.jpg`);

        }
    });
}

const generateAiImages = async (userPrompt, userImgQuantity) => {
    try {
        //Send a request to the OpenAI API to generate images based on user input
        const response = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            prompt: userPrompt,
            n: parseInt(userImgQuantity),
            size: "1024x1024",
            response_format: "b64_json"
        })
    });

    if(!response.ok) throw new Error ("Failed to generate images! Please try again");
        
        const { data } = await response.json(); // gets data from response
        updateImageCard([...data]);
    } catch (error) {
        alert(error.message);
    }
}

const handleFormSubmission = (e) => {
    e.preventDefault();

    // Get user input and image quantity values from the form
    const userPrompt = e.srcElement[0].value;
    const userImgQuantity = e.srcElement[1].value;

    const imgCardMarkup = Array.from({length: userImgQuantity}, () =>
        `<div class="img-card loading">
                <img src="images/loader.svg" alt="image">
                <a href="#" class="download-btn">
                    <img src="images/download.svg" alt="download icon">
                </a>
        </div>`
    ).join("");
    
    imageGallery.innerHTML = imgCardMarkup;
   generateAiImages(userPrompt, userImgQuantity);
} 

generateForm.addEventListener("submit", handleFormSubmission);