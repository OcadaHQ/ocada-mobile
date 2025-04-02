import * as StoreReview from 'expo-store-review';

const onReviewDialogShouldAppear = async () => {
    if (await StoreReview.hasAction()) {
        await StoreReview.requestReview()
        .then(response => {})
        .catch(e => { })
       }
}

export { onReviewDialogShouldAppear };
