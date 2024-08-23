// ==UserScript==
// @name              YouTube Ad Skipper
// @name:en           YouTube Ad Skipper
// @name:vi           YouTube Ad Skipper
// @name:zh-cn         YouTube 广告跳过器
// @name:zh-tw         YouTube 廣告跳過器
// @name:ja           YouTube 広告スキッパー
// @name:ko           YouTube 광고 건너뛰기
// @name:es           YouTube Ad Skipper
// @name:ru           Пропускатель рекламы YouTube
// @name:id           YouTube Ad Skipper
// @name:hi           YouTube विज्ञापन स्किपर
// @namespace        http://tampermonkey.net/
// @version          3.0.0
// @description         Skip ads on YouTube automatically with advanced options, performance improvements, and best video quality selection. Includes features for hiding ad overlays, removing ad slots, and blocking ad domains.
// @description:en      Skip ads on YouTube automatically with advanced options, performance improvements, and best video quality selection. Includes features for hiding ad overlays, removing ad slots, and blocking ad domains.
// @description:vi      Tự động bỏ qua quảng cáo trên YouTube với các tùy chọn nâng cao, cải thiện hiệu suất và lựa chọn chất lượng video tốt nhất. Bao gồm các tính năng ẩn lớp phủ quảng cáo, xóa vị trí quảng cáo và chặn miền quảng cáo.
// @description:zh-cn    自动跳过 YouTube 上的广告，提供高级选项、性能改进和最佳视频质量选择。 包括隐藏广告覆盖层、移除广告位和屏蔽广告域的功能。
// @description:zh-tw    自動跳過 YouTube 上的廣告，提供進階選項、效能改進和最佳影片品質選擇。 包括隱藏廣告覆蓋層、移除廣告位和封鎖廣告網域的功能。
// @description:ja      YouTube の広告を自動的にスキップし、高度なオプション、パフォーマンスの向上、最高のビデオ品質の選択を提供します。 広告オーバーレイの非表示、広告スロットの削除、広告ドメインのブロックなどの機能が含まれています。
// @description:ko      YouTube에서 광고를 자동으로 건너뛰고 고급 옵션, 성능 향상 및 최상의 비디오 품질 선택을 제공합니다。 광고 오버레이 숨기기, 광고 슬롯 제거 및 광고 도메인 차단과 같은 기능이 포함되어 있습니다。
// @description:es      Omite automáticamente los anuncios en YouTube con opciones avanzadas, mejoras de rendimiento y selección de la mejor calidad de video. Incluye funciones para ocultar superposiciones de anuncios, eliminar espacios publicitarios y bloquear dominios de anuncios.
// @description:ru      Автоматически пропускает рекламу на YouTube с расширенными настройками, улучшением производительности и выбором наилучшего качества видео. Включает функции для скрытия рекламных наложений, удаления рекламных блоков и блокировки рекламных доменов.
// @description:id      Lewati iklan secara otomatis di YouTube dengan opsi lanjutan, peningkatan kinerja, dan pemilihan kualitas video terbaik. Termasuk fitur untuk menyembunyikan overlay iklan, menghapus slot iklan, dan memblokir domain iklan.
// @description:hi      YouTube पर विज्ञापनों को स्वचालित रूप से छोड़ें, उन्नत विकल्पों, प्रदर्शन में सुधार और सर्वोत्तम वीडियो गुणवत्ता चयन के साथ। इसमें विज्ञापन ओवरले छिपाने, विज्ञापन स्लॉट हटाने और विज्ञापन डोमेन को ब्लॉक करने की सुविधाएँ शामिल हैं।
// @author           RenjiYuusei
// @license          MIT
// @icon             https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @require         https://update.greasyfork.org/scripts/503318/1426127/Youtube%20Anti-Adblock%20Killer%20By%20RenjiYuusei.js
// @require         https://update.greasyfork.org/scripts/503389/1426440/YouTube%20Hide%20Adblock%20Popup.js
// @match            https://*.youtube.com/*
// @grant            GM_setValue
// @grant            GM_getValue
// @grant            GM_registerMenuCommand
// @grant            GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/502824/YouTube%20Ad%20Skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/502824/YouTube%20Ad%20Skipper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DEFAULT_CONFIG = {
        skipInterval: 300,
        observerThrottle: 300,
        hideAdOverlays: true,
        removeAdSlots: true,
        autoHideAnnotations: true,
        disableAutoplay: true,
        improvePerformance: true,
        skipNonVideoAds: false,
        aggressiveAdRemoval: false,
        performance: {
            hideComments: true,
            hideSidebar: true,
            disableAnimations: true,
            lazyLoadImages: true,
            reduceScriptExecution: true
        }
    };

    let config = {
        ...DEFAULT_CONFIG,
        ...GM_getValue('AdSkipperConfig', {})
    };

    const AD_INDICATORS = [
        '.ytp-ad-skip-button',
        '.ytp-ad-skip-button-modern',
        '.ad-showing',
        '.ytp-ad-overlay-close-button',
        '.ytp-ad-overlay-image',
        'ytd-ad-slot-renderer',
        'ytm-promoted-video-renderer',
        '[id^="ad-text"]',
        '[id^="ad-image"]',
        '.ytp-ad-text',
        '.ytp-ad-preview-text',
        '.ytp-ad-preview-image',
        'ytd-promoted-sparkles-web-renderer',
        'ytd-promoted-video-renderer',
        'ytd-player-legacy-desktop-watch-ads-renderer',
        'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-ads"]',
        '.ytd-video-masthead-ad-v3-renderer',
        'ytd-in-feed-ad-layout-renderer',
        'ytd-ad-slot-renderer',
        'ytd-popup-container > .ytd-popup-container > .ytd-mealbar-promo-renderer',
        '.ytd-display-ad-renderer',
        '.ytd-statement-banner-renderer',
        '.ytd-in-feed-ad-layout-renderer',
        '.ytd-banner-promo-renderer',
        '[layout="display-ad-layout-rendered"]',
        'ytd-ad-break-title-card',
        'ytd-ad-break-preview-renderer',
        'ytd-ad-test-renderer',
        'ytd-ad-legacy-billboard-renderer',
        'ytd-ad-legacy-companion-renderer',
        'ytd-ad-legacy-enhanced-renderer',
        'ytd-in-line-ad-viewer-renderer',
        'ytd-info-panel-container-renderer[style-type="MOVIE_AD_TYPE"]'
    ];

    const createSettingsUI = () => {
        const settingsHTML = `
            <div id="ad-skipper-settings" style="display:none;">
                <h2>YouTube Ad Skipper Settings</h2>
                <form id="ad-skipper-form">
                    ${Object.entries(config).map(([key, value]) => createSettingInput(key, value)).join('')}
                    <button id="save-settings">Save</button>
                    <button id="close-settings">Close</button>
                </form>
            </div>
        `;

        const settingsStyle = `
            #ad-skipper-settings {
  font-family: sans-serif;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  border: none;
  background-color: #f2f2f2;
  padding: 15px;
  border-radius: 12px;
  z-index: 9999;
  max-width: 95%;
  width: 95%;
  position: fixed;
  top: 10%; 
  left: 50%;
  transform: translateX(-50%);
  max-height: 80vh; /* Limit height to 80% of viewport height */
  overflow-y: auto; /* Add vertical scroll if content overflows */
}
 
#ad-skipper-settings h2 {
  margin-top: 0;
  color: #212121;
  font-size: 1.4em;
  font-weight: 600;
  margin-bottom: 15px;
}
 
#ad-skipper-settings label {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  color: #424242;
  font-size: 0.9em;
}
 
#ad-skipper-settings input[type="checkbox"] {
  margin-right: 8px;
  appearance: none;
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border: 2px solid #757575;
  border-radius: 4px;
  outline: none;
  cursor: pointer;
}
 
#ad-skipper-settings input[type="checkbox"]:checked {
  background-color: #1976d2;
  border-color: #1976d2;
}
 
#ad-skipper-settings input[type="checkbox"]:checked::before {
  content: "✓";
  display: block;
  text-align: center;
  color: white;
  font-size: 14px;
  line-height: 16px;
}
 
#ad-skipper-settings input[type="number"] {
  width: 60px;
  padding: 6px;
  border: 1px solid #bdbdbd;
  border-radius: 4px;
  font-size: 0.9em;
}
 
#ad-skipper-settings fieldset {
  border: 1px solid #e0e0e0;
  padding: 12px;
  margin-bottom: 12px;
  border-radius: 8px;
}
 
#ad-skipper-settings legend {
  font-weight: 500;
  padding: 0 8px;
  font-size: 1em;
  color: #546e7a;
}
 
#ad-skipper-settings button {
  background-color: #1976d2;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.2s ease;
}
 
#ad-skipper-settings button:hover {
  background-color: #1565c0;
 }
        `;

        GM_addStyle(settingsStyle);
        document.body.insertAdjacentHTML('beforeend', settingsHTML);

        document.getElementById('save-settings').addEventListener('click', saveSettings);
        document.getElementById('close-settings').addEventListener('click', () => {
            document.getElementById('ad-skipper-settings').style.display = 'none';
        });
    };

    const createSettingInput = (key, value) => {
        if (typeof value === 'boolean') {
            return `<label><input type="checkbox" name="${key}" ${value ? 'checked' : ''}> ${key}</label><br>`;
        } else if (typeof value === 'number') {
            return `<label>${key}: <input type="number" name="${key}" value="${value}"></label><br>`;
        } else if (typeof value === 'object') {
            return `<fieldset>
                <legend>${key}</legend>
                ${Object.entries(value).map(([subKey, subValue]) => 
                    `<label><input type="checkbox" name="${key}.${subKey}" ${subValue ? 'checked' : ''}> ${subKey}</label><br>`
                ).join('')}
            </fieldset>`;
        }
        return '';
    };

    const saveSettings = (event) => {
        event.preventDefault();
        const form = document.getElementById('ad-skipper-form');
        const formData = new FormData(form);

        for (let [key, value] of formData.entries()) {
            if (key.includes('.')) {
                const [parent, child] = key.split('.');
                config[parent][child] = value === 'on';
            } else {
                config[key] = value === 'on' ? true : (value === 'off' ? false : Number(value));
            }
        }

        GM_setValue('AdSkipperConfig', config);
        alert('Settings saved. Refresh the page for changes to take effect.');
    };

    const isAdPresent = () => {
        const video = document.querySelector('video');
        
        const isVisibleAdElement = (element) => {
            const rect = element.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0;
        };

        if (AD_INDICATORS.some(selector => {
            const elements = document.querySelectorAll(selector);
            return Array.from(elements).some(isVisibleAdElement);
        })) {
            return true;
        }

        if (video && video.duration > 0) {
            if (video.duration < 60 && video.currentTime < video.duration) {
                return true;
            }

            const videoUrl = video.src;
            if (videoUrl.includes('googlevideo.com/videoplayback') && videoUrl.includes('oad=')) {
                return true;
            }
        }

        return false;
    };

    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    const memoize = (fn) => {
        const cache = new Map();
        return (...args) => {
            const key = JSON.stringify(args);
            if (cache.has(key)) return cache.get(key);
            const result = fn.apply(this, args);
            cache.set(key, result);
            return result;
        };
    };

    const skipAds = () => {
        if (isAdPresent()) {
            document.querySelectorAll('.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .videoAdUiSkipButton, [id^="visit-advertiser"]').forEach(button => button.click());

            const video = document.querySelector('video');

            if (config.hideAdOverlays) {
                document.querySelectorAll('.ytp-ad-overlay-close-button, .close-button').forEach(button => button.click());
                document.querySelectorAll('.ytp-ad-overlay-image, .ytd-overlay-ad-renderer').forEach(overlay => overlay.style.display = 'none');
            }

            if (config.removeAdSlots) {
                document.querySelectorAll('.ytp-ad-player-overlay, .ytp-ad-overlay-slot').forEach(overlay => overlay.style.display = 'none');
            }

            if (config.skipNonVideoAds) {
                document.querySelectorAll('.ytp-ad-text, .ytp-ad-preview-text, .ytp-ad-preview-image, .ytd-companion-slot-renderer').forEach(element => {
                    const container = element.closest('.ytp-ad-overlay-container, ytd-companion-slot-renderer');
                    if (container) container.style.display = 'none';
                });
            }

            if (config.aggressiveAdRemoval) {
                document.querySelectorAll(AD_INDICATORS.join(', ')).forEach(adElement => {
                    adElement.remove();
                });

                const style = document.createElement('style');
                style.textContent = `
                    .ad-showing { display: none !important; }
                    .ytp-ad-overlay-container { display: none !important; }
                    .ytd-companion-slot-renderer { display: none !important; }
                `;
                document.head.appendChild(style);
            }
        }

        if (config.autoHideAnnotations) {
            document.querySelectorAll('.ytp-ce-covering-overlay, .ytp-ce-element, .iv-promo, .annotation').forEach(overlay => overlay.style.display = 'none');
        }

        if (config.disableAutoplay) {
            const autoplayToggle = document.querySelector('.ytp-autonav-toggle-button[aria-checked="true"]');
            if (autoplayToggle) autoplayToggle.click();
        }
    };

    const optimizedSkipAds = memoize(debounce(skipAds, config.observerThrottle));

    const applyPerformanceImprovements = () => {
        if (!config.improvePerformance) return;

        const styles = `
            ${config.performance.hideSidebar ? `
                .ytd-watch-flexy:not([theater]) #secondary.ytd-watch-flexy,
                ytd-watch-next-secondary-results-renderer {
                    display: none !important;
                }
            ` : ''}
            ${config.performance.hideComments ? `
                #comments {
                    display: none !important;
                }
            ` : ''}
            ${config.performance.disableAnimations ? `
                * {
                    transition: none !important;
                    animation: none !important;
                }
            ` : ''}
            ${config.performance.reduceScriptExecution ? `
                .ytp-ce-element {
                    display: none !important;
                }
            ` : ''}
        `;

        GM_addStyle(styles);

        if (config.performance.lazyLoadImages) {
            document.addEventListener('DOMContentLoaded', () => {
                document.querySelectorAll('img').forEach(img => {
                    img.loading = 'lazy';
                });
            });
        }

        if (config.performance.reduceScriptExecution) {
            let ticking = false;
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        // Handle scroll event here
                        ticking = false;
                    });
                    ticking = true;
                }
            });

            let resizeTimer;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => {
                    // Handle resize event here
                }, 250);
            });
        }
    };

    const init = () => {
        createSettingsUI();
        setInterval(optimizedSkipAds, config.skipInterval);
        applyPerformanceImprovements();

        const observer = new MutationObserver(optimizedSkipAds);
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        window.addEventListener('DOMContentLoaded', optimizedSkipAds);
    };

    GM_registerMenuCommand("YouTube Ad Skipper Settings", () => {
        document.getElementById('ad-skipper-settings').style.display = 'block';
    });

    init();
    })();