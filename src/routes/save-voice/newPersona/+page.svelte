<script lang="ts">
    import type { CreateCompletionResponse } from 'openai';
    import { SSE } from 'sse.js';
    import { initializeApp } from 'firebase/app';
    import { getFirestore, setDoc, addDoc, collection, getDoc } from 'firebase/firestore';
    import { docStore } from "sveltefire";
    import { getAnalytics } from "firebase/analytics";
	import FieldWrapper from "../../../components/field-wrapper.svelte"
    import { Circle } from "svelte-loading-spinners";
    import { getParam } from "../../../utils/url";
    import { onMount } from "svelte";
    import { goto } from '$app/navigation';
	import { to_number } from 'svelte/internal'

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
    $: id = getParam('id')
    $: editMode = id ? true : false

    let message = '';
    let loading = false;
    let error = false;
    let context = '';
    let personaName = '';
    let writingExample = '';
    let answer = '';
    let toneAnalysis = '';
    
   
    $: collectionRef = collection(db, "writingStyles")
    $: textDoc = docStore<any>(db, "writingStyles/"+id);
   

    async function handleSubmit(event: SubmitEvent) {
        event.preventDefault(); // Prevent the default form submission behavior
        loading = true
        const data = new FormData(event.target as HTMLFormElement);

        // Get the text from the textarea
        const writingExample = data.get("writingExample") as string; //make sure to change so it waits till answer is done generating.
        const personaName = data.get("personaName") as string;
        const gettoneAnalysis = toneAnalysis;

        // Update the Firestore document
        if(id){
            await setDoc(textDoc.ref!, {
                writingExample: writingExample,
                personaName: personaName,
                toneAnalysis: gettoneAnalysis,
            })
            
        }
        else{
            await addDoc(collectionRef, {
                writingExample: writingExample,
                personaName: personaName,
                toneAnalysis: toneAnalysis,
            });
        }
        
        message = "Succesfully Saved Persona";

        loading = false
        goto("/save-voice")
        
    }

    const handleSubmitAnalyze = async () => {
		loading = true
		error = false
		answer = ''
		context = ''
		context = writingExample;
        
		const eventSource = new SSE('/api/explain3', {
			headers: {
				'Content-Type': 'application/json'
			},
			payload: JSON.stringify({ context })
		})

		context = ''

		eventSource.addEventListener('error', (e) => {
			error = true
			loading = false
			alert('Something went wrong!')
		})

		eventSource.addEventListener('message', (e) => {
			try {
				loading = false

				if (e.data === '[DONE]') {
                    toneAnalysis = answer;
					//copyDisabled = false;
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

    onMount(() => {
        const id = getParam('id')
        if(id){
            getDoc(textDoc.ref!).then(snapshot => {
                


	
                if(snapshot.exists()){
                    const data = snapshot.data()
                    personaName = data.personaName
                    writingExample = data.writingExample
                    toneAnalysis = data.toneAnalysis
                    
                }
            })
        }
    })

    


</script>


<div class="section p-16 px-72">
    <div class="text-center">
        <div class="text-3xl font-semibold mt-8" >{editMode ? 'Edit' : 'Create'} Your Unique Persona</div>
        <div class="text-sm text-dull my-2">Save your writing style so your persona can be used later on and Touchpoint A.I will write like you.</div>
    </div>

    <form class="max-w-md w-full m-auto flex flex-col items-center p-12" on:submit={handleSubmit}>

        <div class="w-full p-4">
            <FieldWrapper 
                label="Persona Name"
                id="personaName"
            >
                <input 
                    class="form-field"
                    name="personaName" 
                    placeholder="Enter Persona Name Here"
                    bind:value={personaName}
                />
            </FieldWrapper>
            <FieldWrapper 
				label="Generated Email"
                id="writingExample"
			>
				<textarea 
					class="form-field" 
					rows="6" 
					name="writingExample"
                    placeholder="Paste Your Email/Content Writting Examples Here..."
                    bind:value={writingExample}
				/>
			</FieldWrapper>

            <button on:click|preventDefault={handleSubmitAnalyze} class="bg-secondary w-full p-4 rounded-md my-2" >Analyze</button>
            <a href="/save-voice">
                <button type="button" class="bg-dull w-44 p-4 rounded-md my-2">Cancel</button>
            </a>
            {#if toneAnalysis}
            <FieldWrapper 
            label="This represents the brand tone that Touchpoint AI has crafted based on the provided text example."
        >
            <textarea 
                id = "Writng Style Summary"
                class="form-field" 
                rows="10" 
                bind:value={toneAnalysis} 
                style="color: white;"
            />
            </FieldWrapper>
            

            <div class="flex justify-between">
                <button disabled={loading} class="bg-secondary w-44 p-4 rounded-md my-2 flex items-center justify-center">
                    {#if loading}
                        Saving...
                        <Circle size={20} color="white"/>
                        {:else}
                            Save
                    {/if}
                </button>
            </div>
            {/if}
        </div>
    </form>
</div>
