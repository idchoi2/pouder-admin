export const PROMPT_AUTO_CATEGORIZATION_START = `
Your job is to categorize by given contents of website. List of categorizing are website field, and tags. Given contents of website, generate recommended website field and tags.`

export const PROMPT_AUTO_CATEGORIZATION_1 = `
# 1. Website Type
Based on contents, recommend appropriate website type. Website type describes how the website is designed and what it is used for.
You MUST SELECT one of below types options:

- #####TYPES_LIST#####

* DO NOT SELECT ANY OTHER TYPE.`

export const PROMPT_AUTO_CATEGORIZATION_2 = `
# 1. Website Field
Given contents, recommend appropriate website field. Website field describes what the website's main content is about.
You MUST SELECT one of from below fields options:

- #####FIELDS_LIST#####

* DO NOT SELECT ANY OTHER FIELD.
`

export const PROMPT_AUTO_CATEGORIZATION_3 = `
# 2. Tags
You generate up to 20 tags. Terms of tags must be global and common. Tags must not have special characters or spaces. Use underscore to separate words.
You can either select from current list of or create a new one.

Current tags are below:

#####TAGS_LIST#####`

export const PROMPT_AUTO_CATEGORIZATION_TAGS_LANG = `
* Generate tags with this language : #####SELECTED_LANGUAGE#####`

export const PROMPT_AUTO_CATEGORIZATION_END = `
# Output Format

* Return 'website field', and 'list of tags' in 'JSON' object format like below example:
* 'website type' and 'website field' must be uppercase.

{
    "title": "Title of website",
    "bookmark_field": "SPORTS",
    "tags": [
        "News", "Tech", "AI"
    ]
}`

export const PROMPT_GENERATE_BOOKMARK_FIELDS = `Create emoji, label_ko, label_en for '#####NEW_FIELD#####'

## Output in JSON format as below:

{
    "emoji": "🎨",
    "label_ko": "디자인",
    "label_en": "Design"
}`

export const PROMPT_FOLDER_RECOMMENDATIONS = `You are great at managing digital bookmarks by categorizing folders.
Your job is to generate recommended list of folders based on user's prompt.
Terms of a folder must be short, global and commonly used.
Generate at most 10 folders. ---------------- 

## Output Format Return list in JSON format as below:

{
    "list": ["IT", "Design", "Sports"]
}`

export const PROMPT_GENERATE_SEARCH_TYPES_START = `You are a bookmark manager helping users to search bookmarked websites from user’s prompt.
You are very good at analyzing given query question and response proper search type(s) for bookmark search.
`

export const PROMPT_GENERATE_SEARCH_TYPES_INPUT = `
# Input prompt
You will receive "query question (about searching bookmark)" and determine which search type(s) will be generated and return list of search type objects.
Search type object contains "type" and "value".
Possible list of search type: "semantic" and, "date".
Search value(s) can be generated based on search type and user's query question.`

export const PROMPT_GENERATE_SEARCH_TYPES_1 = `
# Search Types

## 1. Date type
If user is asking for date range in query question, generate 'date' type. For 'date' type, search values must be start and end date in 'YYYY-MM-DD hh:mm:ss'. Relative date must be calculated based on current datetime. Current datetime is '#####CURRENT_TIME#####'.

Example: 

{
       "type": "date",
       "value": ["2024-01-01 00:00:00", "2024-01-08 23:59:59"]
}`

/* `다음 사용자가 제시한 문장을 분석하여 작성자가 알고자 하는 목적에 해당하는 키워드를 도출해주세요.
키워드는 문장 내에서 실제 등장하는 핵심 단어를 출력해주세요.
그리고 문장에서 유추할 수 있는 단어들을 출력해주세요. 유추할 단어는 문맥을 고려하여 추출해주세요.
단어들이 문장에서 떨어져 있다면 각각 분리된 키워드로 추출해주세요.
키워드는 중복되어 나오지 않아야 합니다.` */

export const PROMPT_GENERATE_SEARCH_TYPES_2 = `
## 2. Semantic type
Any other search type is 'semantic type'. List of Semantic values will be given.
Do not add any terms related to date in semantic search. (e.g. 'today', 'yesterday', 'tomorrow', 'next week', 'last month', etc.)
`

export const PROMPT_GENERATE_SEARCH_TYPES_RULES = `
# Rules

* Search type objects can be multiple.
* You must have only one 'date' type.
* You can have multiple 'semantic' type and one 'date' type.
* You can have multiple 'semantic' type and no 'date' type.
* You can have one 'date' and no 'semantic' type.
* If both 'date' and 'semantic' type are generated, operator must be set. Select proper operator ('AND' or 'OR') based on query question.
`

export const PROMPT_GENERATE_SEARCH_TYPES_LANG = `
# Languages

* We have supported languages as below:

#####SUPPORTED_LANGUAGES#####

If semantic search exists, translate them and add to final list.
`

export const PROMPT_GENERATE_SEARCH_TYPES_FORMAT = `
# Output Format

* Return list of search 'JSON' objects format as below:

{
    "list": [
        {
           "type": "semantic",
            "value": "Coffee"
        },
        {
           "type": "semantic",
            "value": "커피”
        },
    ]
}`

export const PROMPT_SUMMARIZE_BODY_CONTENTS = `You are a content summarizer who can generate a summary of the given body contents.
Your job is to generate a summary of the given body contents. The summary should be concise and informative. Maximum length of summary is 500 characters.`

export const SAMPLES_USER_BIO = [
  `I am a software developer passionate about innovative apps. Proficient in Javascript and full-stack development. I enjoy playing basketball.`,
  `I am a graphic designer who creates impactful designs. Skilled in Adobe Creative Suite. I love painting in my free time.`,
  `I am a marketing manager focused on brand growth. Experienced in digital marketing and SEO. I like hiking on weekends.`,
]

export const PROMPT_GET_KEYWORDS = `
해당 웹페이지 문서 내용을 보고 사용된 키워드를 모두 추출해주세요.
필요없는 영역 (script, style, ads) 은 제거해야합니다.
키워드는 텍스트 배열 형태로만 출력해주세요.
번역이 가능한 키워드는 한글은 영어로, 영어는 한글로 번역해서 추가해주세요.`

export const PROMPT_GET_KEYWORDS_FROM_ASK = `
우리는 저장된 북마크를 찾아주는 서비스를 제공합니다.
다음 사용자가 제시한 문장을 분석하여 작성자가 알고자 하는 목적에 해당하는 키워드를 도출해주세요.
키워드는 문장 내에서 실제 등장하는 핵심 단어와 문장에서 유추할 수 있는 단어들을 출력해주세요.
단어들이 문장에서 떨어져 있다면 각각 분리된 키워드로 추출해주세요.
키워드는 중복되어 나오지 않아야 합니다.
키워드는 텍스트 배열 형태로만 출력해주세요.
번역이 가능한 키워드는 한글은 영어로, 영어는 한글로 번역해서 추가해주세요.`

export const PROMPT_DETERMINE_SEARCH_TYPE = `
You are a bookmark manager helping users to search bookmarked websites from user’s prompt.
Based on user's query question, determine which search type will be used.
Available search types are 'keyword' and 'question'.

# Keyword: Keword type is used when user's query is about asking for a keyword.
# Question: Question type is used when user's query is about asking for a question.`

export const PROMPT_ANSWER_FROM_USER = `
# Rules
- You need to generate an answer about the user's prompt.
- A set of knowledges will be given to you.
- You only can use the given knowledges to generate an answer.
- Do not use any information outside of the given knowledge.
- If you can't find any information about user's prompt in knowledges you have, you MUST answer to user that you can't find any information.`

export const PROMPT_ANSWER_FROM_USER_FORMAT = `
# Format of the answer:
- Output must be in 'HTML' format.
- You can use various HTML tags such as 'p', 'a', 'cite', 'li', 'table' etc.
- Be creative and make the answer as informative as possible.
- For 'a' tag you must set target="_blank" attribute.
- <cite> tag must be use if knowledge is used in the answer.
- <cite> tag must be inside the 'p' or 'li' tags.
- Make sure use full url including params and hashes (such as ?keyword=abc#source=google).`

export const PROMPT_ANSWER_FROM_USER_SOURCE = `
# Cites:
- You MUST add the source of the knowledge in the answer with <cite> tag at the appropriate place if knowledge is used.
- <cite> tag must contain a single combination of the id and url of the source with 'a' tag for link url with data-id attribute.
- Number of cites will be determined after the sources are generated.
- URLs of the sources must be among the given knowledges. <cite> can be placed multiple times in the answer.
- <cite> tag must be inside the <p> or <li> tags. 

Example:
Q: What is the capital of France?
A: <p>Paris</p> <cite><a href="https://www.wikipedia.com" target="_blank" data-id="{{ID_OF_KNOWLEDGE}}"></a></cite>`

export const PROMPT_LANGUAGE = `
Answer in '{{SELECTED_LANGUAGE}}'.`

export const PROMPT_SOURCES = `
Extract the source of the given content. Sources can be multiple. Show the url of the source.`

export const PROMPT_ANSWER_FORMAT = `
Final output must be in 'JSON' object format like below example:

* <cite> tag must be inside the <p> or <li> tags. 

{
    "sources": ["https://www.wikipedia.com", "https://www.example2.com"],
    "answer": "<p>Answer from user <cite><a href="https://www.wikipedia2.com" target="_blank" data-id="uniqueid"></a></cite></p>"
}`

export const PROMPT_ANSWER_FROM_CITE_INDEX = `
# Cites Rules:
- Cites number means the index of the source in the selected sources
- Counts among the selected sources of urls (not the whole knowledge list).
- Cites number MUST starts from 1.
- <cite> tag must be inside the <p> or <li> tags. 
`

export const PROMPT_ANSWER_NO_INFORMATION = `
AGAIN, If you can't find any information about user's prompt in knowledges you have,
you MUST answer to user that you can't find any information.

Prompt: "{{USER_PROMPT}}"`
