<script lang="ts">
	import type { CreateCompletionResponse } from 'openai'
	import { SSE } from 'sse.js'
    import { initializeApp } from 'firebase/app';
    import { getFirestore, getDocs, collection, Firestore } from 'firebase/firestore';
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

	let selectedTone = ''; // To store the selected tone
  	let toneOptions = ['Option 1', 'Option 2', 'Option 3']; // Add your tone options here



	let context = ''
	let recipientName = ''
	let yourName = ''
	let emailContext = ''
	let writingExample = ''
	

	let loading = false
	let error = false
	let answer = ''

	const handleButtonClick = async (styleName: string) => {
  // Perform the action you want here
		if(styleName == 'Shakespeare'){
			yourName = 'William Shakespeare';
			const response = await fetch(`${process.cwd()}/emailSamples/Shakespeare-email-samples.txt`);
			const text = await response.text();
			writingExample = text;
		}else if(styleName == 'Mohammmed'){
			yourName = 'Mohammed';
			writingExample = "";
		}else if(styleName == 'Erick'){
			yourName = 'Erick' //writingStyles[1]?.personaName;
			const response = await fetch(`${process.cwd()}/emailSamples/Erick-email-samples.txt`);
			const text = await response.text();
			writingExample = text;//writingStyles.find(style => style.personaName == "Bob")?.writingExample;
		}
  	console.log(`${styleName}'s Style button clicked!`);
	};


	const handleSubmit = async () => {
		loading = true
		error = false
		answer = ''
		context = ''
		writingExample = writingStyles.find(style => style.personaName == yourName)?.writingExample; // assigns writing style of binded yourname value selected in drop down menu.
		context = "Write an email to " + recipientName + ", from " + yourName + " and " + emailContext + 
		"Write it in my writing style and tone but do not reiterate words from the text below because it is completely unrelated, only use it as a reference: "  
		+ writingExample;

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
				class="form-field"
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
				/>
			</FieldWrapper>
		{/if}
	</div>
</form>
