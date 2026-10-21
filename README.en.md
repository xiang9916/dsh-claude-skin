# dsh-claude-skin

> **A Claude-style skin for the DSH Web GUI**: warm-black canvas, clay accent, built-in Anthropic font modes, follows the native light/dark theme.  
> Forked from [`PAKIKNOWLEDGE/dsh-client-ui-skin-claude`](https://github.com/PAKIKNOWLEDGE/dsh-client-ui-skin-claude) (MIT)

**About this repository**: this is `xiang9916`'s personal fork. The package name and plugin identity are now `dsh-claude-skin`; the look and behaviour match upstream, serving as a base for further personal tweaks. The upstream version number and Git history have been cleared — history starts from a single initial commit at version `0.0.0`.

![Dark](docs/dark.png) · ![Light](docs/light.png)

## Features

- Warm-black (#141413) canvas with an Anthropic clay (#d97757) accent
- Font modes:
  - **Anthropic native (default)**: Anthropic Sans for UI, Anthropic Serif for conversation, Anthropic Mono for code
  - **Skin serif**: keeps the original serif UI style
  - **System default**: leaves DSH fonts untouched
- Slim scrollbars, clay selection/focus, pill badges
- Light and dark variants that follow the system theme

## Fonts

> **Important: the npm package does not ship font files.** Font files are available in the [`fonts/`](fonts/) folder of this repository; install them manually, then refresh/restart the web UI.

| Font | Used for | File |
|---|---|---|
| Anthropic Sans Web Text | UI | [`fonts/AnthropicSansWebText.ttf`](fonts/AnthropicSansWebText.ttf) |
| Anthropic Serif Web Text | Conversation / Markdown | [`fonts/AnthropicSerifWebText.ttf`](fonts/AnthropicSerifWebText.ttf) |
| Anthropic Mono Variable | Code / code blocks | [`fonts/AnthropicMonoVariable.ttf`](fonts/AnthropicMonoVariable.ttf) |

Install: on Windows double-click each `.ttf` → **Install**; on macOS import with Font Book. Refresh the page afterwards.

> The Anthropic fonts are proprietary to Anthropic and are provided for personal use only. They are **not** covered by the MIT license (see the font notice in [LICENSE](LICENSE)).

## Install

This personal fork is not published on npm yet; installing from source is recommended.

### 1. Pack to a tgz, then install

From the repository root:

```sh
npm pack
# produces dsh-claude-skin-0.0.0.tgz
dsh plugin --profile web add ./dsh-claude-skin-0.0.0.tgz
dsh web
```

- No global `dsh` CLI? Replace `dsh` with `npx @deepseek-ai/dsh`.

### 2. DSH Desktop

Open **Settings → Plugins** and paste the tgz absolute path into the install field.

### 3. From GitHub (available after this repository is pushed)

```sh
dsh plugin --profile web add github:xiang9916/dsh-claude-skin
```

Restart `dsh web`, then refresh the page.

## Switching fonts

Open **Settings → General → Font style**:

- **Anthropic native (default)**: Sans UI / Serif body / Mono code
- **Skin serif**: Georgia-style serif UI
- **System default**: keep DSH's default fonts

The selection applies instantly and is saved in browser localStorage.

> If you previously installed `dsh-anthropic-fonts` separately, remove it first to avoid two font overrides fighting each other.

## Switching skins

Only one skin is active at a time. Edit `~/.dsh/cordis.patch.yml`:

```yaml
# outside the dsh-skin managed section
- insert:
    - id: ui-skin-claude
      name: 'dsh-claude-skin'
```

(and add `disabled: true` to the currently active skin's row). The config watcher hot-reloads within seconds; refresh the page.

## Uninstall

1. Remove the `ui-skin-claude` insert row from `~/.dsh/cordis.patch.yml`.
2. `dsh plugin --profile web remove dsh-claude-skin`
3. Restart `dsh web`.

## License

MIT. Upstream copyright and author credits are retained in [LICENSE](LICENSE); the font files remain copyright Anthropic.
