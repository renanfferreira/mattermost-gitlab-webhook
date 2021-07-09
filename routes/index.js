var axios = require('axios');
var express = require('express');
var router = express.Router();

const getProjectNameFromEnv = env => env.split("_")[1]

const getProjectUrlsFromEnv = projectName => process.env[`PROJECT_${projectName}_URLS`]?.split(',')

const getProjectMmWebhooksFromEnv = projectName => process.env[`PROJECT_${projectName}_MM_WEBHOOKS`]?.split(',')

const onlyUnique = (value, index, self) => self.indexOf(value) === index

const isActionOpen = body => body.object_attributes.action === 'open'

const isReqSafe = req => req.headers['x-gitlab-token'] === process.env.GITLAB_SECRET_TOKEN

const generateProjectObject = projectName => {
  const mmWebhooks = getProjectMmWebhooksFromEnv(projectName)
  const projectUrls = getProjectUrlsFromEnv(projectName)

  return {
    projectName,
    mmWebhooks,
    projectUrls
  }
}

const getProjectByUrl = url => {
  return Object.keys(process.env)
    .filter(env => env.startsWith('PROJECT'))
    .map(getProjectNameFromEnv)
    .filter(onlyUnique)
    .map(generateProjectObject)
    .find(project => project.projectUrls.some(projectUrl => url.indexOf(projectUrl) >= 0))
}

const mountTextMessage = body => {
  return {text: `@here
  ### Novo MR
  | Author | Project | Source | Target | MR |
  |-|-|-|
  | @${body.user.username} | ${body.project.namespace} | ${body.object_attributes.source_branch} | ${body.object_attributes.target_branch} | [${body.object_attributes.title}](${body.object_attributes.url}) |
  `}
}

const sendTextMessages = async reqBody => {
  const textMessage = mountTextMessage(reqBody)

  const project = getProjectByUrl(reqBody.project.http_url)

  if(!project) throw 'Project not found'

  for(const mmWebhook of project.mmWebhooks) {
    await axios.post(mmWebhook, textMessage)
  }
}

router.post('/', async (req, res) => {
  try {
    const reqBody = req.body
  
    if(!isReqSafe(req)) throw 'Request is not safe'
  
    if(isActionOpen(reqBody)) await sendTextMessages(reqBody)

    res.send()
  } catch (err) {
    console.error(err)
    res.status(403).send()
  }
});

module.exports = router;
