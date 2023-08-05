$(document).ready(function () {
    $('.plus-btn').click(function (e) { 
        e.preventDefault();
        
        var inc_value = $(this).closest('.product_data').find('.quantity-input').val();
        var value = parseInt(inc_value,10);
        value = isNaN(value) ? 0 : value;

        if(value < 10){
            value++;
            $(this).closest('.product_data').find('.quantity-input').val(value);
        }
    });

    $('.minus-btn').click(function (e) { 
        e.preventDefault();
        
        var dec_value = $(this).closest('.product_data').find('.quantity-input').val();
        var value = parseInt(dec_value,10);
        value = isNaN(value) ? 0 : value;

        if(value > 1){
            value--;
            $(this).closest('.product_data').find('.quantity-input').val(value);
        }
    });

    $('.addToCartBtn').click(function (e) { 
        e.preventDefault();
        
        var product_id = $(this).closest('.product_data').find('.prod_id').val();
        var product_qty = $(this).closest('.product_data').find('.quantity-input').val();
        var img = $(this).closest('.product_data').find('.img').attr('src');
        var price = $(this).closest('.product_data').find('.price').val();
        // var token = $('input[name=csrfmiddlewaretoken]').val();
        
        $.ajax({
            method: 'POST',
            url: "/add-to-cart",
            data: {
                'prod_id':product_id,
                'prod_qty':product_qty,
                'img':img,
                'price':price
                // csrfmiddlewaretoken:token
            },
            success: function (response) {
                alertify.set('notifier','position', 'top-right');
                if (response.status) {
                    alertify.success(response.status);
                }else{
                    alertify.error(response.data);
                }
            }
        });
    });
}) 