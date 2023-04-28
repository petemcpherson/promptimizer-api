const defaultPrompts = [
    {
        text: `I want to write an article. Here are some details:

Title: {post.keyword}
My brand: {selectedBrand.description}
My writing style: {selectedBrand.style}
Formatting: I want you to format everything in Markdown.

Don't actually write the post or outline yet. Do you understand? A simple yes or no will do.`,
        category: 'intro',
        description: 'test description'
    },
    {
        text: `Here is some more information needed to write this article:

{post.factOne}
{post.factTwo}
{post.factThree}
{post.factFour}
{post.factFive}

I want you to rely on this information to write the article. Do you understand? A simple yes or no will do.`,
        category: 'intro',
        description: 'test description'
    },
    {
        text: `Here are some F.A.Q.s and additional sub-topics:

{post.faqOne}
{post.faqTwo}
{post.faqThree}
{post.faqFour}
{post.faqFive}
        
        I want you to try to address these in the article. Do you understand? A simple yes or no will do.`,
        category: 'intro',
        description: 'test description'
    },
    {
        text: `create the outline`,
        category: 'intro',
        description: 'test description'
    },
    {
        text: `Write the intro. Remember to use markdown formatting.`,
        category: 'intro',
        description: 'test description'
    },
    {
        text: `Write the next section.`,
        category: 'writing',
        description: 'test description'
    },
    {
        text: `Rewrite that to be {selectedBrand.toneOne} and {selectedBrand.toneTwo}`,
        category: 'styling',
        description: 'test description'
    },
    {
        text: `Rewrite that last section to be 20% shorter`,
        category: 'styling',
        description: 'test description'
    },
    {
        text: `Rewrite that to be a little bit longer, with more details.`,
        category: 'styling',
        description: 'test description'
    },
    {
        text: `Rewrite that last section to include a bullet point list.`,
        category: 'styling',
        description: 'test description'
    },
    {
        text: `Rewrite that last section, but this time in first-person narrative.`,
        category: 'styling',
        description: 'test description'
    },
    {
        text: `Rewrite that to have a few more line breaks. Each paragraph should include no more than three sentences.`,
        category: 'styling',
        description: 'test description'
    },
    {
        text: `Rewrite that last section to include some bolded words and/or phrases.

Try to bold the important words that the user definitely needs to see as they scroll the page`,
        category: 'styling',
        description: 'test description'
    },
    {
        text: `Rewrite that to be {selectedBrand.toneOne} and {selectedBrand.toneTwo}, and try to include a bullet point list where appropriate.`,
        category: 'styling',
        description: 'test description'
    }
]

module.exports = defaultPrompts;