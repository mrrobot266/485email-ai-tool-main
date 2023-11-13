<script lang="ts">
    import type { CreateCompletionResponse } from 'openai';
    import { SSE } from 'sse.js';
    import FieldWrapper from "../../components/field-wrapper.svelte";
    import Login from './login.svelte'; // Ensure the correct path
    import History from './history.svelte';
    import { initializeApp } from 'firebase/app';
    import { getFirestore, setDoc, getDocs, collection, Firestore } from 'firebase/firestore';
    import { docStore } from "sveltefire";
    import { getAnalytics } from "firebase/analytics";
    import { onMount } from 'svelte';
    import ContentView from './contentView.svelte';

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

function parseOutline(outline: string): string[] {
    // This is a simple example. Adapt this logic based on your actual outline format.
    // Let's assume each section starts with a number followed by a period (e.g., "1. Introduction")
    return outline.split(/\d+\./).filter(section => section.trim() !== '');
}

let writingStyles: any[] = [];

onMount(async () => {
        writingStyles = await getPersonas(db);
    });

    let context = '';
    let requirement = '';
    let writingExample = '';


    //new code
    let targetAudience = '';
    let keywords = '';
    let tone = '';
    let targetwordCount = '';
    let yourName = '';

    let context2 = '';
    let loading2 = false;
    let error2 = false;
    let answer2 = '';
    let copyDisabled2 = true;
    
    let loading = false;
    let error = false;
    let answer = '';
    let copyDisabled = true;

    // let selectedContent = null;
    let showLogin = false; // Add this to track if the login modal should be shown
    let showHistory = false;

    const handleSubmit = async () => {
		loading = true
		error = false
		answer = ''
		context = ''
		context = "Create an outline for a comprehensive 3000-4000 word article about " + requirement + 
		", give speculated word counts for each section. Write it for the target audience being: " + targetAudience +
        ". also need to have word 'section' at begining of each section in outline";

		const eventSource = new SSE('/api/explain2', { // create eventsource which opens Server sent events connection to endpoint
			headers: {
				'Content-Type': 'application/json' //indicates json data 
			},
			payload: JSON.stringify({ context })  // serializes the context variable as a JSON string and sends it as part of the request's payload data.
		}) //returns text eventstream response

		context = ''

		eventSource.addEventListener('error', (e) => { //listens for errors
			error = true
			loading = false
			alert('Something went wrong!')
		})

		eventSource.addEventListener('message', (e) => { //listens for new messages/tokens coming in, thats why new text continually shows up on screen
			try {
				loading = false             //no longer loading

				if (e.data === '[DONE]') { //Completion of message request is terminated by 'Done'
					copyDisabled = false;
					return
				}

				const completionResponse: CreateCompletionResponse = JSON.parse(e.data)

				const [{ text }] = completionResponse.choices  //The response from chatgpt is located in choices[text] section. first index of choices array
                        // answer or '' if empty.
				answer = (answer ?? '') + text  // Stream: tokens sent as data-only server-sent events as they become available
			} catch (err) {
				error = true
				loading = false
				console.error(err)
				alert('Something went wrong!')
			}
		})

		eventSource.stream()
	}

    const handleSubmitArt = async () => {
		loading2 = true
		error2 = false
		answer2 = ''
		context = ''
		// context = "Create an article based on this outline: " + answer +
		// ", Write it in this writing style and tone: " + tone + ", and inlcude these keywords: " + keywords;
        
        const outlineSections = parseOutline(answer); // Parse the outline into sections
        let articleSections: string[] = [];
        for (const section of outlineSections) {
            context = "Create content for this section: " + section.trim() +
            ", Write it in this writing style and tone: " + tone + ", and include these keywords: " + keywords;

            try {
                const sectionContent = await generateSectionContent(context);
                articleSections.push(sectionContent);
            } catch (err) {
                console.error("Error generating content for section:", err);
                // Handle the error appropriately
            }
        }
		const eventSource = new SSE('/api/explain2', {
			headers: {
				'Content-Type': 'application/json'
			},
			payload: JSON.stringify({ context })
		})

		context = ''
        
		eventSource.addEventListener('error', (e) => {
			error2 = true
			loading2 = false
			alert('Something went wrong!')
		})

		eventSource.addEventListener('message', (e) => {
			try {
				loading2 = false

				if (e.data === '[DONE]') {
					//copyDisabled = false;
					return
				}

				const completionResponse: CreateCompletionResponse = JSON.parse(e.data)

				const [{ text }] = completionResponse.choices

				answer2 = (answer2 ?? '') + text
			} catch (err) {
				error2 = true
				loading2 = false
				console.error(err)
				alert('Something went wrong!')
			}
		})

		eventSource.stream()
	}

	const copyToClipboard = () => {
		const elem = document.createElement('textarea')
		elem.value = answer
		document.body.appendChild(elem)
		elem.select()
		document.execCommand('copy')
		document.body.removeChild(elem)
		alert('Copied to clipboard!')
 	}
    async function generateSectionContent(context: string): Promise<string> {
    // Placeholder for your API call logic
    // Similar to the existing API call in your code
    // Return the content for each section
        return new Promise((resolve, reject) => {
            const eventSource = new SSE('/api/explain2', {
                headers: { 'Content-Type': 'application/json' },
                payload: JSON.stringify({ context })
            });

            let sectionContent = '';

            eventSource.addEventListener('error', (e) => {
                eventSource.close();
                reject(new Error('Error in generating content for section'));
            });

            eventSource.addEventListener('message', (e) => {
                if (e.data === '[DONE]') {
                    eventSource.close();
                    resolve(sectionContent); // Resolve the promise with the accumulated content
                    return;
                }

                try {
                    const completionResponse: CreateCompletionResponse = JSON.parse(e.data);
                    const [{ text }] = completionResponse.choices;
                    sectionContent += text;
                } catch (err) {
                    eventSource.close();
                    reject(new Error('Parsing error in generating content for section'));
                }
            });

            eventSource.stream();
        });
    }
</script>

<header>
    <nav>
        <button on:click={() => showLogin = !showLogin}>Login</button>
        {#if showLogin}
            <Login />
        {/if}

        <button on:click={() => showHistory = true}>History</button>
        {#if showHistory}
            <History visible={showHistory} onClose={() => showHistory = false} />
        {/if}
    </nav>
</header>

<div class="max-w-md w-full m-auto flex flex-col items-center p-12">
    <h1 class="text-3xl font-semibold">Write Me an Article</h1>
    <h2 class="text-sm text-dull my-6">Please fill out the details</h2>
    <form on:submit|preventDefault={handleSubmit} class="w-full p-4">
        <FieldWrapper 
        label="Tone & Style"
        >
        <div class="relative">
            <select placeholder="Custom Tone" class="form-field w-full" bind:value={yourName}>
                <option value="">Custom Tone</option>
                {#each writingStyles as style}
                <option value={style.personaName}>{style.personaName}</option>
                {/each}
            </select>
            <span class="absolute right-4 top-5 arrow"/>
        </div>

        <input type="text" class="form-field w-full" placeholder="Ex: conversational, informative, energetic..." bind:value={tone}>
        </FieldWrapper>

        <FieldWrapper label="Target Audience">
            <textarea class="form-field w-full h-10" name="target audience" bind:value={targetAudience} placeholder="Ex: Small businesses, Mothers, Students..."></textarea>
        </FieldWrapper>

        <FieldWrapper label="Keywords">
            <textarea class="form-field w-full h-10" name="keywords" bind:value={keywords} placeholder="Ex: Innovation, Subscription, Pre-order..."></textarea>
        </FieldWrapper>

        <FieldWrapper label="What is the article about?">
            <textarea class="form-field w-full h-20" name="requirement" bind:value={requirement} placeholder="Describe the article topic here"></textarea>
        </FieldWrapper>
        
        <button class="bg-secondary w-full p-4 rounded-md my-2">Write Outline for Article</button>
        {#if answer}
        <FieldWrapper 
            label="Generated Outline"
        >
            <textarea 
                class="form-field" 
                rows="20" 
                bind:value={answer} 
                style="color: white;"
            />
        </FieldWrapper>
        <button on:click|preventDefault={copyToClipboard} class="bg-secondary w-full p-4 rounded-md my-2" disabled={copyDisabled}>Copy</button>
        <button on:click|preventDefault={handleSubmitArt} class="bg-secondary w-full p-4 rounded-md my-2" >Generate Article</button>
        <FieldWrapper 
        label="Generated Article"
    >
        <textarea 
            id = "Custom Article"
            class="form-field" 
            rows="20" 
            bind:value={answer2} 
            style="color: white;"
        />
        </FieldWrapper>
    {/if}
    </form>


        
   
</div>

<footer>
    <!-- Footer content remains unchanged -->
</footer>
