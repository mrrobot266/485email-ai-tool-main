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
    import { marked } from 'marked';


  
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

    const sectionRegex = /Section \d+: /g;

    return outline.split(sectionRegex).filter(section => section.trim() !== '');
}
let showHistory = false;
let writingStyles: any[] = [];
let markdownContent = '';
        /**
	 * @type {any}
	 */
let htmlContent;

onMount(async () => {
        writingStyles = await getPersonas(db);
        htmlContent = marked(markdownContent);
    });

    $: if (answer2) {// if answer2 is edited or is still generating, html content will update. 
        htmlContent = marked(answer2);
    }

    let context = '';
    let requirement = '';
    let writingExample = '';

    let structure = '. Structure: - Organize with clear headings and subheadings. - Use bullet points and numbered lists for scannability. - Include an intro paragraph previewing the content. - Close with a summary paragraph recapping key takeaways. Content Development: - Provide history, context, and background information where needed. - Explain concepts clearly and thoroughly, anticipating questions. - Include relevant examples, anecdotes, quotes, statistics, and visual aids. When you do, cite the source URL. - Do not fabricate any statistics or information. Always base your content on existing information. - Offer practical tips, actionable advice, and specific recommendations. Provide examples. - Encourage reader interaction and engagement with questions. Formatting: - Check spelling, grammar, punctuation, capitalization, and syntax. - Break into readable paragraph lengths. - Use bolding, italics, and headlines to direct focus when appropriate.';

    //new code
    let targetAudience = '';
    let keywords = '';
    let toneStyle = '';
    let targetwordCount = '';
    let yourName = '';
    let articleLength = '';
    let lengthOptions = ['Short (1000-1500 words)', 'Medium (2000- 2500 words)', 'Long (3000-4000 words)']; // Add your tone options here


    let context2 = '';
    let loading2 = false;
    let error2 = false;
    let answer2 = '';
    let copyDisabled2 = true;
    
    let loading = false;
    let error = false;
    let answer = '';
    let copyDisabled = true;
    let requestCount = 0;
    let dividedSections = [];
    // let selectedContent = null;
    let showLogin = false; // Add this to track if the login modal should be shown

    const handleSubmit = async () => {
		loading = true
		error = false
		answer = ''
		context = ''
		context = "Create an outline for a comprehensive" + articleLength + " article about " + requirement + 
		", give speculated word counts for each section. Write it for the target audience being: " + targetAudience +
        ". Also, remember that it needs to have the word 'section' at begining of each suggested part in outline and a title at the top of the outline";

		const eventSource = new SSE('/api/explainOutline', { // create eventsource which opens Server sent events connection to endpoint
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
  
    const generateSectionContent = async (context, sectionIndex, totalSections) => {
        const eventSource = new SSE('/api/explain2', {
            headers: { 'Content-Type': 'application/json' },
            payload: JSON.stringify({ context })
        });

        return new Promise((resolve, reject) => {
            let sectionContent = '';
            eventSource.addEventListener('error', (e) => {
                eventSource.close();
                reject(new Error('Error in generating content for section'));
            });

            eventSource.addEventListener('message', (e) => {
                if (e.data === '[DONE]') {
                    eventSource.close();
                    resolve(sectionContent);
                    requestCount++;
                    return;
                }
                try {
                    const completionResponse = JSON.parse(e.data);
                    const [{ text }] = completionResponse.choices;
                    sectionContent += text;
                } catch (err) {
                    eventSource.close();
                    reject(new Error('Parsing error in generating content for section'));
                }
            });

            eventSource.stream();
        });
    };


    const handleSubmitArt = async () => {
        loading2 = true;
        error2 = false;
        answer2 = '';
	if(yourName != 'Custom Tone'){
            toneStyle = writingStyles.find(style => style.personaName == yourName)?.toneAnalysis; 
        }
        //console.log("Full outline:", answer);
        const outlineSections = parseOutline(answer); // Parse the outline into sections
        //console.log("Divided Sections:", outlineSections);
        dividedSections = outlineSections;
        // Print the sections to the console
        //console.log("Outline Sections:", outlineSections);
        for (let i = 0; i < outlineSections.length; i++) {
            const section = outlineSections[i];
            context = "### " + section.trim() +" ###" +
            ". Generate the article in markdown syntax. Your task is to write this section of the article by adhering to the provided outline instructions. Write it in this writing style and tone: " 
            + toneStyle + ", and include these keywords if relevant: " + keywords 
            + ". Generate the article in markdown syntax.";

            try {
                const sectionContent = await generateSectionContent(context, i, outlineSections.length);
                answer2 += sectionContent; // Append the content of each section to answer2
                requestCount++;
            } catch (err) {
                console.error("Error generating content for section:", err);
                break; // Stop further processing on error
            }
        }

        loading2 = false;
        error2 = answer2 === ''; // If no content is generated, consider it an error
    };

	const copyToClipboard = () => {
		const elem = document.createElement('textarea')
		elem.value = answer2
		document.body.appendChild(elem)
		elem.select()
		document.execCommand('copy')
		document.body.removeChild(elem)
		alert('Copied to clipboard!')
 	}
	function toggleHistory() {
	    showHistory = !showHistory;
	}
	function closeHistory() {
		showHistory = false;
	}

</script>

<style>
    	.section-content {
        /* Add any styles you want for the section content here */
        	padding-bottom: 10px; /* Space at the bottom of each section */
    	}
    	.section-separator {
        	height: 2px; /* The thickness of the separator line */
        	background-color: black; /* Color of the separator line */
       		margin: 10px 0; /* Space above and below the line */
    	}
	nav {
	        display: flex;
	        justify-content: center; /* Center the button horizontally */
    	}
	button.history-button {
	        background-color: #343a40; /* Bootstrap primary color */
	        color: white;
	        padding: 0.5rem 1rem;
	        margin: 0.5rem;
	        border: none;
	        border-radius: 0.25rem;
	        cursor: pointer;
	        font-size: 1rem;
	        transition: background-color 0.15s ease-in-out;
	}
	.fixed-top-left {
	        position: fixed;
	        top: 200;
	        left: 0;
	        margin: 1rem;
	        z-index: 1050; /* Ensure it's above the modal */
	}
	
	.history-button {
	    /* ... */
	}
	button.history-button:hover {
	        background-color: #23272b; /* Darken color on hover */
	}
</style>


<header>
    <nav>
        <button class="history-button fixed-top-left" on:click={toggleHistory}>History</button>
    </nav>
</header>
{#if showHistory}
    <History bind:visible={showHistory} onClose={closeHistory} />
{/if}
<div class="max-w-md w-full m-auto flex flex-col items-center p-12">
    <h1 class="text-3xl font-semibold">Write Me an Article</h1>
    <h2 class="text-sm text-dull my-6">Please fill out the details</h2>
    <!-- <p>Number of requests sent: {requestCount}</p> -->
    <div class="request-count-display">
        <p>Number of Requests Made: {requestCount}</p>
    </div>

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

        <input type="text" class="form-field w-full" placeholder="Ex: conversational, informative, energetic..." bind:value={toneStyle}>
        </FieldWrapper>

        <FieldWrapper label="Target Audience">
            <textarea class="form-field w-full h-10" name="target audience" bind:value={targetAudience} placeholder="Ex: Small businesses, Mothers, Students..."></textarea>
        </FieldWrapper>

        <FieldWrapper label="Keywords">
            <textarea class="form-field w-full h-10" name="keywords" bind:value={keywords} placeholder="Ex: Innovation, Subscription, Pre-order..."></textarea>
        </FieldWrapper>

        <FieldWrapper 
        label="Article Length"  >

        <div class="relative">
            <select placeholder="Long (3000-4000 words)" class="form-field w-full" bind:value={articleLength}>
                <option value="">Select Length</option>
                {#each lengthOptions as eachlength}
                    <option value={eachlength}>{eachlength}</option>
                {/each}
            </select>
            <span class="absolute right-4 top-5 arrow"/>
        </div>
    </FieldWrapper>

        <FieldWrapper label="What is the article about?">
            <textarea class="form-field w-full h-20" name="requirement" bind:value={requirement} placeholder="Describe the article topic here"></textarea>
        </FieldWrapper>

        <button class="bg-secondary w-full p-4 rounded-md my-2">Write Outline for Article</button>
        {#if answer}
            <FieldWrapper label="Generated Outline">
                <textarea 
                    class="form-field" 
                    rows="20" 
                    bind:value={answer} 
                    style="color: white;"
                />
            </FieldWrapper>
            {#if dividedSections.length > 0}
                <h2>Number of Divided Sections: {dividedSections.length}</h2>
            {/if}
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
            <button on:click|preventDefault={copyToClipboard} class="bg-secondary w-full p-4 rounded-md my-2" disabled={copyDisabled}>Copy</button>
        {/if}
    </form>
</div>
<div class="article-container">
    {@html htmlContent}
</div>

<footer>
    <!-- Footer content remains unchanged -->
</footer>

<footer>
    <!-- Footer content remains unchanged -->
</footer>
