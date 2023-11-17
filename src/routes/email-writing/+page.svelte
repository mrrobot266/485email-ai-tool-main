<script lang="ts">
	import type { CreateCompletionResponse } from 'openai'
	import { SSE } from 'sse.js'
	//import { Link } from 'svelte-navigator';
    import { initializeApp } from 'firebase/app';
    import { getFirestore, setDoc, getDocs, collection, Firestore } from 'firebase/firestore';
    import { docStore } from "sveltefire";
    import { getAnalytics } from "firebase/analytics";
    import { onMount } from 'svelte';
	import FieldWrapper from "../../components/field-wrapper.svelte"

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
   // const analytics = getAnalytics(app);

async function getPersonas(db: Firestore) {
  const writingStylesCollection  = collection(db, 'writingStyles');
  const querySnapshot  = await getDocs(writingStylesCollection);
  const writingStylesData  = querySnapshot .docs.map(doc => doc.data());
  return writingStylesData ;
}


let writingStyles: any[] = [];

onMount(async () => {
        writingStyles = await getPersonas(db);
    });


let selectedEmailType = ''; // To store the selected tone
   let emailOptions = ['General Email', 'Email Drip Campaign', 'Respond to Email']; // Add your tone options here



	let context = ''
	let recipientName = ''
	let yourName = ''
	let emailContext = ''
	let writingExample = ''
	let toneStyle = '';

	let loading = false
	let error = false
	let answer = ''

	let emailCampaignContext = ''


	const handleSubmit = async () => {
		loading = true
		error = false
		answer = ''
		context = ''
		toneStyle = writingStyles.find(style => style.personaName == yourName)?.toneAnalysis; // assigns writing style of binded yourname value selected in drop down menu.
		if(selectedEmailType == 'Email Drip Campaign'){
			emailCampaignContext = "Develop a comprehensive email drip marketing campaign centered around "  + emailContext;
			context = emailCampaignContext + ". The campaign should be designed to resonate with the recipient, " + recipientName + ", and will be sent from, " + yourName + ". Divide the content into three separate emails. Label the first email as 'Email 1', the second as 'Email 2', and the third as 'Email 3'. Place these labels at the beginning of each respective email and add emojis. Also, write it the following tone and style: " + toneStyle;
		}else if(selectedEmailType == 'Respond to Email'){ 
		context = "Write an email response to " + recipientName + ", from " + yourName + " centered around: " + emailContext + "Also be sure to write it the following tone and style: " + toneStyle;
		}else { 
		context = "Write an email to " + recipientName + ", from " + yourName + " and " + emailContext + 
		"Write it in the writing style and tone of the following:  "  + toneStyle;
		}

		const eventSource = new SSE('/api/explain', {
			headers: {
				'Content-Type': 'application/json'
			},
			payload: JSON.stringify({ context })
		})

		context = 	
''

		eventSource.addEventListener('error', (e) => {
			error = true
			loading = false
			alert('Something went wrong!')
		})

		eventSource.addEventListener('message', (e) => {
			try {
				loading = false

				if (e.data === '[DONE]') {
					return
				}

				const completionResponse: CreateCompletionResponse = JSON.parse(e.data)

				const [{ text }] = completionResponse.choices

				answer = (answer ?? '') + text
			} catch (err) {
				error = true
				loading = false
				console.error(err)
				alert('Something went wrong!')
			}
		})

		eventSource.stream()
	}
</script>

<form class="max-w-md w-full m-auto flex flex-col items-center p-12" on:submit|preventDefault={() => handleSubmit()}>
	<div class="text-3xl font-semibold">Write Emails In My Writing Style</div>
	<div class="text-sm text-dull my-6">Please fill out the details</div>

	<div class="w-full p-4">
		<FieldWrapper 
			label="Select email type"
		>
			<div class="relative">
				<select placeholder="Select" class="form-field w-full" bind:value={selectedEmailType}>
					<option value="">Select</option>
					{#each emailOptions as eachoption}
					<option value={eachoption}>{eachoption}</option>
					{/each}
				</select>
				<span class="absolute right-4 top-5 arrow"/>
			</div>
		</FieldWrapper>

		<FieldWrapper 
			label="Tone(persona)"
		>
			<div class="relative">
				<select placeholder="Select" class="form-field w-full" bind:value={yourName}>
					<option value="">Select</option>
					{#each writingStyles as style}
					<option value={style.personaName}>{style.personaName}</option>
					{/each}
				</select>
				<span class="absolute right-4 top-5 arrow"/>
			</div>
		</FieldWrapper>
		<FieldWrapper 
			label="Recipient Name"
			id="recipientName"
		>
			<input 
				class="form-field w-full"
				name="recipientName" 
				bind:value={recipientName} 
				placeholder="Enter Recipient Name Here"
			/>
		</FieldWrapper>
		
		<FieldWrapper 
			label="What is the email about?"
			id="emailContext"
		>
			<textarea 
				class="form-field h-52"
				name="emailContext" 
				rows="1" 
				bind:value={emailContext} 
				style="color: white;"
			/>
		</FieldWrapper>
		<button class="bg-secondary w-full p-4 rounded-md my-2">Write Email</button>
		<div class="my-8 border-[0] border-b border-line"/>
		{#if answer}
			<FieldWrapper 
				label="Generated Email"
			>
				<textarea 
					class="form-field" 
					rows="20" 
					bind:value={answer} 
					style="color: white;"
				/>
			</FieldWrapper>
		{/if}
	</div>
</form>

<style>
	.form-field {
		background: transparent;
		border: 1px solid white;
		font-size: 18px;
		padding: 10px;
		border-radius: 10px;
	}
	option {
		color: black;
	}
	::-ms-input-placeholder { /* Edge 12-18 */
		color: white;
	}

	::placeholder {
		color: gray;
	}
	select {
		/* for Firefox */
		-moz-appearance: none;
		/* for Chrome */
		-webkit-appearance: none;
		cursor: pointer;
	}

	/* For IE10 */
	select::-ms-expand {
		display: none;
	}
	.arrow {
		width: 0; 
		height: 0; 
		border-left: 12px solid transparent;
		border-right: 12px solid transparent;
		
		border-top: 12px solid white;
		border-radius: 4px;
		pointer-events: none;
	}
</style>
