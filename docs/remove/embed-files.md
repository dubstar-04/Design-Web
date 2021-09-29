# Embed files

With docsify 4.6 it is now possible to embed any type of file.
You can embed these files as video, audio, iframes, or code blocks, and even Markdown files can even be embedded directly into the document.

For example, here embedded a Markdown file. You only need to do this:

```markdown
[filename](_media/example.md ':include')
```

Then the content of `example.md` will be displayed directly here

[filename](_media/example.md ':include')

You can check the original content for [example.md](_media/example.md ':ignore').

Normally, this will compiled into a link, but in docsify, if you add `:include` it will be embedded.

## Embedded file type

Currently, file extension are automatically recognized and embedded in different ways.

This is a supported embedding type:

* **iframe** `.html`, `.htm`
* **markdown** `.markdown`, `.md`
* **audio** `.mp3`
* **video** `.mp4`, `.ogg`
* **code** other file extension

Of course, you can force the specified. For example, you want to Markdown file as code block embedded.

```markdown
[filename](_media/example.md ':include :type=code')
```

You will get it

[filename](_media/example.md ':include :type=code')

## Tag attribute

If you embed the file as `iframe`, `audio` and `video`, then you may need to set the attributes of these tags.

```markdown
[cinwell website](https://cinwell.com ':include :type=iframe width=100% height=400px')
```

[cinwell website](https://cinwell.com ':include :type=iframe width=100% height=400px')

Did you see it? You only need to write directly. You can check [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe) for these attributes.

## The code block highlight

Embedding any type of source code file, you can specify the highlighted language or automatically identify.

```markdown
[](_media/example.html ':include :type=code text')
```

⬇️

[](_media/example.html ':include :type=code text')

?> How to set highlight? You can see [here](language-highlight.md).
