import { useEffect } from "react";
import { BASE_API } from "../../utils/api";

const SEO = ({
    slug,
    data,
    defaultTitle = "Club Pro Mfg",
    defaultDescription = "Premium Golf Cart Parts & Accessories"
}) => {
    useEffect(() => {
        const updateMetaTags = (seoData) => {
            if (!seoData) return;

            // Update Document Title
            document.title = seoData.seoTitle || defaultTitle;

            // Update Meta Description
            let metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
                metaDesc = document.createElement('meta');
                metaDesc.name = 'description';
                document.head.appendChild(metaDesc);
            }
            metaDesc.content = seoData.seoDescription || defaultDescription;

            // Update Meta Keywords
            let metaKeywords = document.querySelector('meta[name="keywords"]');
            if (!metaKeywords) {
                metaKeywords = document.createElement('meta');
                metaKeywords.name = 'keywords';
                document.head.appendChild(metaKeywords);
            }
            metaKeywords.content = seoData.seoKeywords || "";
        };

        if (data) {
            updateMetaTags(data);
        } else if (slug) {
            const fetchSeo = async () => {
                try {
                    const res = await fetch(`${BASE_API}/seo/${slug}`);
                    if (res.ok) {
                        const fetchedData = await res.json();
                        updateMetaTags(fetchedData);
                    }
                } catch (err) {
                    console.error(`SEO fetch failed for ${slug}`, err);
                }
            };
            fetchSeo();
        }
    }, [slug, data, defaultTitle, defaultDescription]);

    return null;
};

export default SEO;
