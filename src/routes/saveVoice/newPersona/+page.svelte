<script lang="ts">
    import { initializeApp } from 'firebase/app';
    import { getFirestore, setDoc } from 'firebase/firestore';
    import { docStore } from "sveltefire";
    import { getAnalytics } from "firebase/analytics";

    const firebaseConfig = {
  apiKey: "AIzaSyAFxmdgTabKYliNNrZVj0s2XCFZPfwTyps",
  authDomain: "touchpoint-capstone-database.firebaseapp.com",
  projectId: "touchpoint-capstone-database",
  storageBucket: "touchpoint-capstone-database.appspot.com",
  messagingSenderId: "1032080279652",
  appId: "1:1032080279652:web:9a53f2acb5069e91513771",
  measurementId: "G-HH2QG68FLN"
};

    const app = initializeApp(firebaseConfig);
    const db = getFirestore();
    const analytics = getAnalytics(app);

    let message = '';

    const textDoc = docStore<any>(db, "writingStyles/1");

        async function handleSubmit(event: SubmitEvent) {
        event.preventDefault(); // Prevent the default form submission behavior
        
        const data = new FormData(event.target as HTMLFormElement);

        // Get the text from the textarea
        const writingExample = data.get("writingExample") as string;
        const personaName = data.get("personaName") as string;

        // Update the Firestore document
        await setDoc(textDoc.ref!, {
            writingExample: writingExample,
            personaName: personaName,
        });
        message = "Succesfully Saved Persona";
    }


	// let context = ''
	// let personaName = ''
	// let writingExample = ''

	// let loading = false
	// let error = false
	// let answer = ''


    // const handleSubmit2 = async () => {
	// 	loading = true
	// 	error = false
	// 	answer = ''
	// 	context = ''
	
	// }


</script>



<div class="fullpage">

    <h1 style="margin-bottom: 10px;">Create Your Unique Persona</h1>
    <h4 style="margin-bottom: 50px;">Save your writing style so your persona can be used later on and Touchpoint A.I will write like you.</h4>

</div>

<form on:submit={handleSubmit}>

    <div style="display: flex; align-items: center; margin-bottom: 30px;">
		<label for="personaName" style="margin-right: 10px;">Persona Name</label>
		<textarea name="personaName" rows="1" style="flex: 1;" ></textarea>
	</div>

    <label for="personaName" style="margin-right: 10px;">Touchpoint AI will analyze the writing example you provide here to understand and adapt its communication style to match yours.</label>
    <textarea name="writingExample"></textarea>
    <input type="submit"/>
</form>

<p>{message}</p>

<!-- {$textDoc?.writingExample} -->


<style>
    /* Style for the submit button */
    input[type="submit"] {
        background-color: #0074d9; /* Button background color */
        color: #fff; /* Button text color */
        padding: 10px 20px; /* Padding around the button text */
        border: none; /* Remove default border */
        cursor: pointer; /* Add a pointer cursor on hover */
        border-radius: 5px; /* Add rounded corners */
    }

    /* Style for the submit button on hover */
    input[type="submit"]:hover {
        background-color: #0056b3; /* Change background color on hover */
    }
</style>