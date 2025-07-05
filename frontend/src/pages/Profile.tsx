import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { User, Settings, Bell, Shield, Save, Edit3 } from 'lucide-react'
import { toast } from 'sonner'

export function Profile() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+62 812-3456-7890',
    company: 'Smart Home Solutions',
    role: 'Administrator'
  })

  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    smsAlerts: false,
    autoAC: true,
    dataLogging: true,
    remoteAccess: true
  })

  const handleSave = () => {
    setIsEditing(false)
    toast.success('Profile updated successfully!')
  }

  const handleSettingChange = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
    toast.success('Setting updated')
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Profile & Settings" />
      
      <div className="flex-1 p-4 md:p-6 space-y-4 md:space-y-6 overflow-y-auto">
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Personal Information</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Update your personal information and contact details
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      disabled={!isEditing}
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      disabled={!isEditing}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      disabled={!isEditing}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={profileData.company}
                      disabled={!isEditing}
                      onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Role</Label>
                  <div>
                    <Badge variant="default">{profileData.role}</Badge>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end">
                    <Button onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">156</div>
                    <p className="text-sm text-muted-foreground">Days Active</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">2,847</div>
                    <p className="text-sm text-muted-foreground">Data Points Logged</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">98.5%</div>
                    <p className="text-sm text-muted-foreground">System Uptime</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Settings
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Configure how you want to be notified about system events
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications in the browser
                    </p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={settings.notifications}
                    onCheckedChange={() => handleSettingChange('notifications')}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-alerts">Email Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified via email for important events
                    </p>
                  </div>
                  <Switch
                    id="email-alerts"
                    checked={settings.emailAlerts}
                    onCheckedChange={() => handleSettingChange('emailAlerts')}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sms-alerts">SMS Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive critical alerts via SMS
                    </p>
                  </div>
                  <Switch
                    id="sms-alerts"
                    checked={settings.smsAlerts}
                    onCheckedChange={() => handleSettingChange('smsAlerts')}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Preferences</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Configure automatic system behaviors
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-ac">Automatic AC Control</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow system to control AC automatically
                    </p>
                  </div>
                  <Switch
                    id="auto-ac"
                    checked={settings.autoAC}
                    onCheckedChange={() => handleSettingChange('autoAC')}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="data-logging">Data Logging</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable continuous sensor data logging
                    </p>
                  </div>
                  <Switch
                    id="data-logging"
                    checked={settings.dataLogging}
                    onCheckedChange={() => handleSettingChange('dataLogging')}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="remote-access">Remote Access</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow remote monitoring and control
                    </p>
                  </div>
                  <Switch
                    id="remote-access"
                    checked={settings.remoteAccess}
                    onCheckedChange={() => handleSettingChange('remoteAccess')}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Manage your account security and access
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>Password</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Last changed 30 days ago
                    </p>
                    <Button variant="outline">Change Password</Button>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Add an extra layer of security to your account
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Disabled</Badge>
                      <Button variant="outline" size="sm">Enable 2FA</Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <Label>Active Sessions</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Manage your active login sessions
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Current Session</p>
                          <p className="text-sm text-muted-foreground">
                            Windows • Chrome • Jakarta, Indonesia
                          </p>
                        </div>
                        <Badge variant="default">Active Now</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}