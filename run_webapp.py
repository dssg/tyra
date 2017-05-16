from webapp import app
import os
port = os.environ.get('PORT', 7000)
try:
    port = int(port)
    app.run(debug=True, host='localhost', port=port)
except ValueError as e:
    print('Tyra not started: {}'.format(e))
