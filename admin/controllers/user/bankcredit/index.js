var header = require('../header')
, template = require('./template.html')

module.exports = function(userId) {
    var $el = $('<div class="admin-bank-credit">').html(template())
    , controller = {
        $el: $el
    }

    // Navigation partial
    $el.find('.nav-container').replaceWith(header(userId, 'bank-credit').$el)

    $el.on('submit', 'form', function(e) {
        e.preventDefault()

        var $el = $(this)

        var body = {
            user_id: userId,
            amount: $el.find('.amount input').val(),
            reference: $el.find('.reference input').val(),
            currency_id: $el.find('[name="currency"]').val()
        }

        if (!body.amount) return alert('amount id not set')
        if (!body.currency_id) return alert('currency_id not set')
        if (!body.reference) return alert('reference not set')

        $el.addClass('is-loading').enabled(false)

        api.call('admin/bankCredit', body, { type: 'POST' })
        .always(function() {
            $el.removeClass('is-loading').enabled(true)
        })
        .fail(errors.alertFromXhr)
        .done(function() {
            $el.find('input').val('')
            $el.find('.user input').focusSoon()
        })
    })

    $el.find('.nav a[href="#admin/credit"]').parent().addClass('active')

    function renderCurrencies() {
        var $currency = $el.find('[name="currency"]')
        $currency.html($.map(api.currencies.value, function(currency) {
            if (!currency.fiat) return
            return format('<option value=%s>%s', currency.id, currency.id)
        }))
    }

    api.on('currencies', renderCurrencies)
    api.currencies.value || api.currencies()

    controller.destroy = function() {
        api.off('currencies', renderCurrencies)
    }

    return controller
}
