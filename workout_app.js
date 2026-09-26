let user_details = []; 

function take_user_details() {
    let name = document.getElementById("name").value,
        age = document.getElementById("age").value,
        weight = document.getElementById("weight").value,
        height = document.getElementById("height").value;

    
    if (!name || !age || !weight || !height) {
        alert("Insert data first");
        return; 
    }


    let user = {
        id: user_details.length + 1, 
        name: name,
        age: parseInt(age), 
        weight: parseFloat(weight), 
        height: parseFloat(height),
        workouts: [],
        goals: [],
        achievements: ["First Workout Logged"],
        challenge: {}
    };

  
    user_details.push(user);
    localStorage.setItem("user_details", JSON.stringify(user_details));
    console.log(user_details);
    

    window.location.href="profile.html";
}

function load_profile() {

    let user_details = JSON.parse(localStorage.getItem("user_details")) || [],
    user = user_details[0];

    document.getElementById("display-name").innerText = user.name;
    document.getElementById("display-age").innerText = user.age;
    document.getElementById("display-weight").innerText = user.weight;
    document.getElementById("display-height").innerText = user.height;
    console.log(user_details);

   
}
function loadEntries(arg) {
   
    let section = arg + '-list',
    user_details = JSON.parse(localStorage.getItem("user_details")) || [],
    user = user_details[0],
    entries = (arg === "workout") ? user.workouts : (arg === "goals") ? user.goals : [],
    list = document.getElementById(section);

    list.innerHTML = ""; 

    entries.forEach((entry, index) => {
        let iconHTML = "",
         detailsHTML = "";
        
        if (arg === "workout") {
            
            let isFavorite = entry.favorite ? 'bi-heart-fill text-danger' : 'bi-heart';
            iconHTML = `<i class="bi ${isFavorite} favorite-icon" onclick="toggleFavorite(${index},'workout')"></i>`;
            detailsHTML = `
                <div>
                    <strong>${entry.type}</strong> - ${entry.duration} min, ${entry.calories} cal
                    <br><small>${entry.date}</small>
                </div>
            `;
        } if (arg =="goals") {
            
            iconHTML = `<i class="bi bi-lightbulb trick-icon" onclick="toggleFavorite(${index},'goals')"></i>`;
            detailsHTML = `
                <div>
                    <strong>${entry.Goaltype}</strong> - Target: ${entry.target}
                    <br><small>${entry.date ? entry.date : ""}</small>
                </div>
            `;
        }
        
        let li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center mt-4 round p-3 bg-primary-subtle hover-zoom";
        li.innerHTML = detailsHTML + iconHTML;
        list.appendChild(li);
    });

    console.log(`${arg} loaded:`, entries);
}


function workout_log() {
    let user_details = JSON.parse(localStorage.getItem("user_details")) || [];

    if (user_details.length === 0) {
        alert("User profile not found. Please enter your details first.");
        return;
    }

    console.log(user_details);
    let user = user_details[0]; // Get first user


    let workoutType = document.getElementById("workoutType").value,
        duration = document.getElementById("duration").value,
        calories = document.getElementById("calories").value,call = "workout";

    if (!workoutType || !duration || !calories) {
        alert("Please fill in all fields.");
        return;
    }

    let workout = {
        type: workoutType,
        duration: parseInt(duration),
        calories: parseInt(calories),
        date: new Date().toISOString().split("T")[0],
        favorite: false
    };

    user.workouts.push(workout);

    // Save updated user_details back to localStorage
    localStorage.setItem("user_details", JSON.stringify(user_details));

    alert("Workout logged successfully!");

    document.getElementById("workout-form").reset();

    
    loadEntries(call);
}


function goal_log() {
    let goal_type = document.getElementById("goalType").value,
        target_value = document.getElementById("goalTarget").value,
        user_details = JSON.parse(localStorage.getItem("user_details")) || [],
        user = user_details[0],
        movitation=['NEVER QUIT','WE DONT GIVEUP','NO PAIN NO GAIN','IT JUST GETTING STARTED'],
        counter=Math.floor(Math.random()*4);
 
        
    // Create a new goal object
    let user_goal = {
        Goaltype: goal_type,
        target: parseInt(target_value),
        isdone: false,
        date: new Date().toISOString().split("T")[0] 
    };

    user.goals.push(user_goal);

    localStorage.setItem("user_details", JSON.stringify(user_details));

    alert("Goal logged successfully!");

    document.getElementById("goal-form").reset();
    alert(movitation[counter]);

    // Reload goal
    loadEntries("goals");
}

function loadFavoriteWorkouts() {

    let user_details = JSON.parse(localStorage.getItem("user_details")) || [],
    user = user_details[0];

    if (user_details.length === 0) {
        console.log("No user data found.");
        return;
    }

    
    // Check workout length
    if (!user.workouts || user.workouts.length === 0) {
        console.log("No workouts found.");
        document.getElementById("workout-list").innerHTML = `<p>No favorite workouts yet.</p>`;
        return;
    }


    // Filter favorite workouts
    let favoriteWorkouts = user.workouts.filter(workout => workout.favorite);

    let list = document.getElementById("workout-list");
    list.innerHTML = ""; // Clear previous entries

   
    if (favoriteWorkouts.length === 0) {
        list.innerHTML = `<p>No favorite workouts yet.</p>`;
        return;
    }

    // Loop through 
    favoriteWorkouts.forEach((workout, index) => {
        let li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center mt-4 round p-3 bg-warning-subtle hover-zoom";

        li.innerHTML = `
            <div>
                <strong>${workout.type}</strong> - ${workout.duration} min, ${workout.calories} cal
                <br><small>${workout.date}</small>
            </div>
            <i class="bi bi-heart-fill text-danger favorite-icon " onclick="toggleFavorite(${index}, 'workouts')"></i>
        `;

        list.appendChild(li);
    });

    console.log("Favorite workouts loaded:", favoriteWorkouts);
}

// load favourite workout 
document.addEventListener("DOMContentLoaded", loadFavoriteWorkouts);


//function call other functions
function logging(params) {
    let retrun_func=params=="Workoutlog"?workout_log():goal_log();
    

}


function progressBar() {
    let user_details = JSON.parse(localStorage.getItem("user_details")) || [],
    user = user_details[0];



    
    let completedGoals = user.goals.filter(goal => goal.isdone).length;
    let totalGoals = user.goals.length;

    let progress = Math.round((completedGoals / totalGoals) * 100);

    progress = Math.max(0, Math.min(progress, 100));

    updateProgressUI(progress);

   
}


function updateProgressUI(progress) {
    let progressBar = document.querySelector(".progress-bar");

    if (progressBar) {
        progressBar.style.width = `${progress}%`;
        progressBar.setAttribute("aria-valuenow", progress);
        progressBar.innerText = `${progress}%`;
    }
}


document.addEventListener("DOMContentLoaded", progressBar);



function toggleFavorite(arg, property) {
    let user_details = JSON.parse(localStorage.getItem("user_details")) || [],
    user = user_details[0];

    if (user_details.length === 0) {
        console.log("No user data found");
        return;
    }


    let iconClass = (property === "workout") ? "favorite-icon" : "trick-icon";
    let icons = document.querySelectorAll(`.${iconClass}`);

    
    if (property === "workout") {
    
        user.workouts[arg].favorite = !user.workouts[arg].favorite;
        let isFavorite = user.workouts[arg].favorite;

    
        icons[arg].className = `bi ${isFavorite ? 'bi-heart-fill text-danger' : 'bi-heart'} favorite-icon`;

    } if (property === "goals") {
  
        user.goals[arg].isdone = !user.goals[arg].isdone;
        let isDone = user.goals[arg].isdone;
        console.log(isDone);
        
        icons[arg].className = ` onclick=${progressBar()}bi ${isDone ? 'bi-lightbulb-fill text-warning' : 'bi-lightbulb'} trick-icon`;
        

       
    }

    localStorage.setItem("user_details", JSON.stringify(user_details));

}




function statistics_func() {
    let user_details = JSON.parse(localStorage.getItem("user_details")) || [],
    user = user_details[0]; 

    if (user_details.length === 0) {
        console.log("No user data found");
        return;
    }

    
    let total_workouts = user.workouts.length; // sum of workouts
    let total_calburnt = user.workouts.reduce((sum, w) => sum + w.calories, 0);

    let validDurations = user.workouts
    .map(w => w.duration).filter(duration => duration > 0); // filter duration >0
  
    let Avg_duration = validDurations.reduce((sum, duration) => { return sum + duration

    }, 0);
    
    

    document.getElementById("totalWorkouts").textContent =total_workouts;
    document.getElementById("totalCalories").textContent = total_calburnt;
    document.getElementById("averageDuration").textContent = Avg_duration/total_workouts;


    let workoutTypes = {};

    user.workouts.forEach(workout => {
        if (!workoutTypes[workout.type]) {
            workoutTypes[workout.type] = { duration: 0, calories: 0 };
        }
        workoutTypes[workout.type].duration += workout.duration;
        workoutTypes[workout.type].calories += workout.calories;
    });

    let labels = Object.keys(workoutTypes);
    let durations = labels.map(type => workoutTypes[type].duration);
    let calories = labels.map(type => workoutTypes[type].calories);

    
    drawBarChart(labels, durations);
    drawPieChart(labels, calories);
}


// Bar Chart
function drawBarChart(labels, durations) {
    let ctx = document.getElementById('barChart').getContext('2d'); // bar id canvas
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Total Duration (minutes)',
                data: durations,
                backgroundColor: ['#ff6384', '#36a2eb', '#ffcd56', '#4bc0c0'],
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
                
            }
            
        }
    });
}

// Pie Chart
function drawPieChart(labels, calories) {
    let ctx = document.getElementById('pieChart').getContext('2d'); // pie id canvas
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'Calories Burned',
                data: calories,
                backgroundColor: ['#ff6384', '#36a2eb', '#ffcd56', '#4bc0c0'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true
            
        }
    });
}


document.addEventListener("DOMContentLoaded", statistics_func);

function updateAchievements() {
    let user_details = JSON.parse(localStorage.getItem("user_details")) || [];

    if (user_details.length === 0) {
        console.log("No user data found.");
        return;
    }

    let user = user_details[0],
    badgesElement = document.getElementById("badges");

    if (!user.achievements || user.achievements.length === 0 || user.workouts.length==0) {
        badgesElement.innerHTML = "🏆 No achievements yet";
        return;
    }
    
    
    badgesElement.innerHTML = user.achievements.map(achievement => `🏅 ${achievement}`).join("<br>");
}

// Function challenge countdown
function startChallenge() {
    let challengeElement = document.getElementById("challenge-time"),
    user_details = JSON.parse(localStorage.getItem("user_details")) || [],
    user = user_details[0];

   
    // Set the challenge 
    let endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    user.challenge.endDate = endDate.toISOString();
    localStorage.setItem("user_details", JSON.stringify(user_details));

    updateChallengeCountdown();
}

// Function to update the challenge 
function updateChallengeCountdown() {
    let challengeElement = document.getElementById("challenge-time");
    let user_details = JSON.parse(localStorage.getItem("user_details")) || [];

    if (user_details.length === 0 || !user_details[0].challenge.endDate) {
        challengeElement.innerText = "No challenge set";
        return;
    }

    let endDate = new Date(user_details[0].challenge.endDate);
    let interval = setInterval(() => {
        let now = new Date();
        let timeLeft = endDate - now;

        if (timeLeft <= 0) {
            clearInterval(interval);
            challengeElement.innerText = "🎉 Challenge Completed!";
            return;
        }

        let days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        let hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        challengeElement.innerText = `⏳ ${days}d ${hours}h ${minutes}m ${seconds}s left`;
    }, 1000);
}

//load fuctions
document.addEventListener("DOMContentLoaded", () => {
    updateAchievements();
    updateChallengeCountdown();
});

function clearUserData() {
    let confirmClear = confirm("⚠️ Are you sure you want to clear all your data? This action cannot be undone.");
    
    if (!confirmClear) {
        return; 
    }

    // Clear localStorage
    localStorage.removeItem("user_details");

    // Reset UI elements
    document.getElementById("display-name").innerText = "-";
    document.getElementById("display-age").innerText = "-";
    document.getElementById("display-weight").innerText = "-";
    document.getElementById("display-height").innerText = "-";
    document.getElementById("workout-list").innerHTML = `<p>No workouts logged yet.</p>`;
    document.getElementById("goals-list").innerHTML = `<p>No goals logged yet.</p>`;
    document.getElementById("badges").innerText = "🏆 No achievements yet";
    document.getElementById("challenge-time").innerText = "No challenge set";
    document.getElementById("challenge-time").innerHTML="<p>No challenges yet</p>"

    // Reset progress bar
    let progressBar = document.querySelector(".progress-bar");
    if (progressBar) {
        progressBar.style.width = "0%";
        progressBar.innerText = "0%";
    }

    alert("✅ All data has been cleared!");
 
    }
