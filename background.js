// chrome.runtime.onInstalled.addListener(() => {
//     chrome.action.setBadgeText({
//       text: "OFF",
//     });
//   });



// chrome.action.onClicked.addListener(async (tab) => {
//     const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
    
//     await chrome.action.setBadgeText({
//         tabId: tab.id,
//         text: nextState,
//     })
// });