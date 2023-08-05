let reviewForm = document.querySelector('.review-rating-form');

$(document).ready(function () {
    
   
    $(document).on("click", '.delete-cart-current-product', function(e){
        e.preventDefault();

        let confirmation = confirm("Are you sure you want to remove the product from cart?");

        if(confirmation){
            var product_id = $(this).closest('.product_data').find('.product_id').val();
            

            $.ajax({
                method: "POST",
                url: "/delete-cart-product",
                data: {
                    'product_id':product_id,
                    
                },
                success: function (response) {
                    alertify.set('notifier','position', 'top-right');
                    alertify.success(response.status);
                    $('.card-data').load(location.href + " .card-data");
                }
            });
        }
        else{
            $('.card-data').load(location.href + " .card-data");
        }
    });
    
    
});