# Building an agent on the corporate track

For SingHealth staff who want to start building an agent at work without
much hassle. Written 6 October 2026 from Microsoft Learn (read that day; see
references.md) and from what the owner reports is available in Microsoft
Teams. Motus answers from this file.

## What staff already have

The owner reports that Microsoft 365 Copilot in Teams is available to
SingHealth staff, with these agents in the Agents panel:

- **Prompt Coach**: help writing, analysing, fixing and checking prompts.
- **AI Learning Advisor**: learning plans, key concepts, what to use when.
- **Idea Coach**.
- **New agent**: Agent Builder, for building your own.

Two other corporate tools, in the owner's words:

- **Agentsea**, with Microsoft SharePoint as the document hub.
- **Pair**, with Pair Chat and for.sg as the document hub.

## The easiest route: New agent (Agent Builder)

Agent Builder builds what Microsoft calls a declarative agent: Copilot with
your instructions, your sources and your starter prompts. No code.

1. **Pick one real task** you or your team repeat every week, such as
   onboarding questions or where a form or guideline lives.
2. **Open New agent.** In Microsoft Teams (desktop or web), open Copilot and
   choose New agent. It is not on the mobile apps.
3. **Describe it in plain words** on the Describe tab. Agent Builder fills
   in the name, description, instructions and starter prompts for you. Or
   choose Skip to configure and fill them in yourself (name up to 30
   characters, description up to 1,000, instructions up to 8,000). There
   are also templates.
4. **Add knowledge.** Up to 100 SharePoint files (and one SharePoint list),
   50 OneDrive files, four public website addresses, five Teams chats, and
   20 files uploaded from your device. The agent respects the permissions
   and sensitivity labels already on SharePoint and OneDrive files.
5. **Switch on Only use specified sources** so it prefers your sources and
   says when it cannot find an answer. This prioritises your sources; it
   does not fully block general knowledge (stricter control needs Copilot
   Studio).
6. **Test on the Try it tab.** Ask ten real questions and check each answer
   against its source before anyone else sees the agent.
7. **Share small first**: with specific people, then a Teams channel. Putting
   it in the organisation's catalogue goes through administrator approval.

### Rules for clinical settings

- Never add patient-identifiable data, colleague details you would not
  email, or documents you are not allowed to share. Anyone who can use the
  agent can see answers drawn from files uploaded into it.
- An agent that answers questions about guidelines and resources is a
  different thing from one that advises on a patient. Keep it to the first.
- You stay accountable for what it says. Check, then share.

### Limits worth knowing

- **Licence.** With Copilot Chat alone, agents can use instructions and the
  public web. Grounding on SharePoint, embedded files or Copilot connectors
  needs a Microsoft 365 Copilot licence or pay-as-you-go billing enabled by
  the organisation. Which SingHealth staff have which is not public; check
  with your IT team.
- Agents built this way cannot be used inside Teams group or one-to-one
  chats.
- If SharePoint's Restricted SharePoint Search is switched on, SharePoint
  cannot be used as a source.
- **No actions.** Agent Builder cannot add actions, connectors to other
  systems or workflows. For those, the agent is copied to Copilot Studio.

## The next step up: Copilot Studio

Copilot Studio adds actions (Power Automate flows and connectors) and
Model Context Protocol (MCP) tools. A useful way to choose:

- If the agent only needs to **know**: knowledge (Agent Builder is enough).
- If it needs to **look something up or calculate**: tools, including MCP.
- If it needs to **do** something (send, log, update): Power Automate.

Start with knowledge. Add actions only when the knowledge agent is trusted.

## Is MCP allowed on the corporate side?

Researched 6 October 2026. Short answer: **not knowable from public
sources; ask before you build.**

- **Agent Builder (New agent) cannot use MCP at all**, because it cannot add
  actions or connectors (Microsoft Learn, Agent Builder overview).
- **MCP is a Copilot Studio feature.** It needs generative orchestration
  switched on, and Copilot Studio currently supports MCP tools and
  resources (Microsoft Learn, Extend your agent with Model Context
  Protocol, updated 26 August 2026).
- **Administrators control it.** MCP servers reach Copilot Studio through
  the connector infrastructure, so the organisation's Power Platform data
  loss prevention policies can allow or block them (Microsoft Power
  Platform blog, April 2025). Authoring in Copilot Studio also needs a
  licence and the admin to have enabled it.
- **No public SingHealth, Synapxe or GovTech statement** on MCP in Copilot
  Studio was found. The AI Learning Advisor offering Copilot Studio help
  suggests Copilot Studio is in use somewhere in the tenant, but that is not
  confirmation that staff may build with it, or that MCP connectors are
  permitted.
- **Who to ask:** your department's IT contact, or the team that runs
  Microsoft 365 for SingHealth. Ask two questions: can I author in Copilot
  Studio, and are MCP connectors allowed by our data loss prevention
  policy?

## Sources

- Microsoft Learn, Agent Builder overview, updated 30 September 2026.
- Microsoft Learn, Build agents in Agent Builder, updated 30 September 2026.
- Microsoft Learn, Add knowledge sources to an agent in Agent Builder,
  updated 30 September 2026.
- Microsoft Learn, Set up your development environment (agent capabilities
  and licensing models), updated 30 September 2026.
- Microsoft Learn, Extend your agent with Model Context Protocol (Copilot
  Studio), updated 26 August 2026.
- Microsoft Power Platform blog, Introducing Model Context Protocol (MCP)
  in Copilot Studio, 28 April 2025.
