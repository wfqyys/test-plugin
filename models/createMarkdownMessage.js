import sizeOf from 'image-size';

export default async function createMarkdownMessage(file, text_start = "", img_url = "", text_end = "") {
    let markdownData = {
        text_start: text_start || "",
        img_url: img_url || "",
        text_end: text_end || "",
        image_dimensions: null,
        file: file || ""
    };

    // 图片处理部分（仅当file为本地文件路径时执行）
    if (file && typeof file === 'string') {
        try {
            let buffer = await Bot.Buffer(file);
            let imgSize = sizeOf(buffer);
            markdownData.image_dimensions = `text #${imgSize.width}px #${imgSize.height}px`;

            // 如果需要上传并获取网络URL
            markdownData.img_url = await Bot.fileToUrl(file);
        } catch (error) {
            console.error(`Error occurred while processing the image: ${error.message}`);
        }
    } else if (img_url) {
        // 如果传入的是网络URL，直接使用
        markdownData.img_url = img_url;
    }

    const imageDescription = markdownData.image_dimensions
        ? { key: "img_dec", values: [markdownData.image_dimensions] }
        : null;

    const mdMessage = segment.raw({
        type: "markdown",
        custom_template_id: "102042175_1702627707",
        params: [
            { key: "text_start", values: [markdownData.text_start] },
            imageDescription,
            { key: "img_url", values: [markdownData.img_url] },
            { key: "text_end", values: [markdownData.text_end] },
        ].filter(param => param && param.values[0]),
    });

    return mdMessage;
}