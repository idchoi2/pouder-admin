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
You generate up to 10 tags. Terms of tags must be global and common. Tags must not have special characters or spaces. Use underscore to separate words.
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

export const PROMPT_GENERATE_SEARCH_TYPES_2 = `
## 2. Semantic type
Any other search type is 'semantic type'. Get appropriate term from query question and use it as the value of semantic search.
Do not add any terms related to date in semantic search. (e.g. 'today', 'yesterday', 'tomorrow', 'next week', 'last month', etc.)

Example: 

{
        "type": "semantic",
       "value": "Basketball history"
}`

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
        {
            "type": "date",
            "value": ["2024-01-01 00:00:00", "2024-01-08 23:59:59"]
        }
    ],
    "operator": "AND"
}
    
OR

{
    "list": [
        {
            "type": "date",
            "value": ["2024-01-01 00:00:00", "2024-01-08 23:59:59"]
        }
    ],
}
    
OR

{
    "list": [
        {
           "type": "semantic",
            "value": "Startup"
        },
        {
           "type": "semantic",
            "value": "스타트업"
        }
    ]
}`

export const SAMPLES_USER_BIO = [
  `I am a software developer passionate about innovative apps. Proficient in Javascript and full-stack development. I enjoy playing basketball.`,
  `I am a graphic designer who creates impactful designs. Skilled in Adobe Creative Suite. I love painting in my free time.`,
  `I am a marketing manager focused on brand growth. Experienced in digital marketing and SEO. I like hiking on weekends.`,
]
